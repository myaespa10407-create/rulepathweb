import { COURSE_TOPICS } from '../data/courseTopics';
// Logic form 3.3.1 (kết quả): tóm tắt, kết luận, chi tiết khối, cảnh báo, hệ quả,
// gợi ý môn lần sau, việc cần làm, nguồn. Thuần, không phụ thuộc giao diện.
// Số tín khối dùng lại buildElectiveView để khớp với form 3.3.
import {
  blockOf,
  buildElectiveView,
  type BlockView,
  type ElectiveBlock,
} from './electiveRules';
import {
  isCounted,
  isVisible,
  type CatalogCourse,
  type SelectedCourse,
  type StudentRules,
} from './profileLogic';
import { SITUATIONS, type SituationId } from './situationLogic';
import { SEMESTER_MAX, SEMESTER_MIN, SEMESTER_SOURCE, type SemesterView } from './semesterRules';
import { prereqsOf } from '../data/prerequisites';

const B2_PREFIX = 'I. Ngoài 129 TC';

export const DISCLAIMER =
  'Kết quả chỉ mang tính tham khảo. Hãy đối chiếu với cổng đăng ký chính thức và Phòng Đào tạo.';

export const TUITION_NOTE =
  'Học phí ngành Ngôn ngữ Anh khóa QH.2024–QH.2025: 3.800.000 đồng/tháng (Quyết định học phí 2026–2027, mục 3.2.1). ';

export type Severity = 'nghiem_trong' | 'luu_y';

export interface ChosenCourse {
  code: string;
  name: string;
  credits: number;
  language_code: string | null;
  block: ElectiveBlock | 'B2';
}

export interface AnalysisWarning {
  severity: Severity;
  text: string;
  source: string;
}

// Một dòng học trước của môn đang chọn
export interface PrereqLine {
  course: string;      // mã môn đang chọn
  prereq: string;      // mã môn học trước
  ok: boolean;         // đã đạt (đã học)
  text: string;
}

// Gợi ý môn cho các học kỳ sau (liên quan đến môn đã đăng ký hoặc đang chọn)
export interface Suggestion {
  code: string;
  name: string;
  credits: number;
  reason: string;
}

export interface AnalysisResult {
  situation: SituationId;
  situationLabel: string;
  question: string;
  excludedNotOpen: string[];  // môn đã chọn nhưng chưa có lớp mở, không đưa vào kết quả

  semester: SemesterView;   // tổng tín học kỳ, dùng cho cảnh báo 14–55 TC
  blocks: BlockView[];
  chosen: ChosenCourse[];   // môn đang chọn thuộc các khối II.2, III.2, IV.2.2
  b2: ChosenCourse[];       // môn B2 đang chọn (không tính tín khối, GPA, học phí)
  conclusion: string;
  warnings: AnalysisWarning[];
  consequences: string[];
  prereqs: PrereqLine[];
  suggestions: Suggestion[];
  nextSteps: string[];
  sources: string[];
}

// Nhãn ngắn cho cột trạng thái trong bảng tín theo khối
export function statusText(b: BlockView): string {
  if (b.status === 'du') return 'Đủ';
  if (b.status === 'vuot') return `Vượt ${-b.remaining} TC`;
  return `Còn thiếu ${b.remaining} TC`;
}

function isB2(c: CatalogCourse): boolean {
  return c.section.startsWith(B2_PREFIX) && !!c.language_code;
}

// Môn đang chọn phải đúng dòng CTĐT áp dụng cho sinh viên (khối tự chọn hoặc B2)
function findPicked(catalog: CatalogCourse[], code: string, rules: StudentRules) {
  return catalog.find(
    (c) => c.code === code && isVisible(c, rules) && (isCounted(c) || isB2(c)),
  );
}

export function buildAnalysis(args: {
  catalog: CatalogCourse[];
  courses: SelectedCourse[];
  rules: StudentRules;
  selected: string[];
  situation: SituationId;
  question: string;
  openCodes?: Set<string>;   // môn có lớp mở trong TKB chung. Không truyền thì không lọc.
}): AnalysisResult {
  const { catalog, courses, rules, situation, question, openCodes } = args;

  // Chỉ đưa vào kết quả các môn đang mở đăng ký trong TKB chung
  const isOpen = (code: string) => !openCodes || openCodes.has(code);
  const excludedNotOpen: string[] = [];
  const selected: string[] = [];
  for (const code of args.selected) {
    if (isOpen(code)) selected.push(code);
    else if (findPicked(catalog, code, rules)) excludedNotOpen.push(code);
  }

  const view = buildElectiveView({ catalog, courses, rules, selected });
  const semester = view.semester;

  const chosen: ChosenCourse[] = [];
  const b2: ChosenCourse[] = [];
  const pickedRows: CatalogCourse[] = [];
  for (const code of selected) {
    const c = findPicked(catalog, code, rules);
    if (!c) continue;
    pickedRows.push(c);
    const base = { code: c.code, name: c.name, credits: c.credits, language_code: c.language_code ?? null };
    if (isB2(c)) {
      b2.push({ ...base, block: 'B2' });
      continue;
    }
    const block = blockOf(c.section);
    if (block) chosen.push({ ...base, block });
  }
  chosen.sort((a, b) => a.code.localeCompare(b.code));
  b2.sort((a, b) => a.code.localeCompare(b.code));

  const overBlocks = view.blocks.filter((b) => b.status === 'vuot');
  const hasPick = chosen.length + b2.length > 0;

  // ---- Cảnh báo: vượt khối, tổng học kỳ 14–55 TC, còn thiếu khối ----
  const warnings: AnalysisWarning[] = [];
  for (const b of view.blocks) {
    if (b.status === 'vuot') {
      warnings.push({
        severity: 'nghiem_trong',
        text: `${b.title} vượt ${-b.remaining} TC (đã có ${b.done}, đang chọn ${b.picked}, tối đa ${b.required} TC). Hãy bỏ bớt môn.`,
        source: `CTĐT NNA QH25 – khối ${b.id}`,
      });
    }
  }
  // Khối III.2 phải đăng ký đúng 6 TC: thiếu hay thừa đều được nêu rõ
  const iii2 = view.blocks.find((b) => b.id === 'III.2')!;
  if (iii2.status === 'thieu') {
    warnings.push({
      severity: 'luu_y',
      text: `Khối III.2 phải đăng ký đúng ${iii2.required} TC, hiện còn thiếu ${iii2.remaining} TC.`,
      source: 'CTĐT NNA QH25 – khối III.2 (tự chọn 6/39)',
    });
  }
  if (semester.status === 'vuot') {
    warnings.push({
      severity: 'nghiem_trong',
      text: `Tổng tín học kỳ là ${semester.total} TC (đã đăng ký ${semester.registered} + đang chọn ${semester.picked}), vượt ${semester.over} TC so với mức tối đa ${SEMESTER_MAX} TC.`,
      source: SEMESTER_SOURCE,
    });
  }
  if (semester.status === 'thieu') {
    warnings.push({
      severity: 'luu_y',
      text: `Tổng tín học kỳ là ${semester.total} TC (đã đăng ký ${semester.registered} + đang chọn ${semester.picked}), còn thiếu ${semester.missing} TC để đạt mức tối thiểu ${SEMESTER_MIN} TC.`,
      source: SEMESTER_SOURCE,
    });
  }
  for (const b of view.blocks) {
    if (b.status === 'thieu' && b.id !== 'III.2') {
      warnings.push({
        severity: 'luu_y',
        text: `${b.title} còn thiếu ${b.remaining} TC. Bạn có thể học thêm ở các năm sau.`,
        source: `CTĐT NNA QH25 – khối ${b.id}`,
      });
    }
  }
  if (b2.length > 0) {
    warnings.push({
      severity: 'luu_y',
      text: 'Học phần B2 là môn tự chọn tự do: không tính vào các khối tự chọn, không tính GPA, không tính học phí.',
      source: 'Phòng Đào tạo và Người học – quy định học phần B2',
    });
  }

  for (const code of excludedNotOpen) {
    warnings.push({
      severity: 'luu_y',
      text: `Môn ${code} chưa có lớp mở đăng ký trong TKB chung HK1 2026-2027, nên không đưa vào kết quả này.`,
      source: 'TKB chung HK1 2026-2027 (hiện là dữ liệu mô phỏng)',
    });
  }

  // ---- Kết luận ----
  let conclusion: string;
  if (!hasPick) {
    conclusion = 'Bạn chưa chọn môn nào ở form 3.3, nên chưa có kết quả đăng ký để phân tích.';
  } else {
    const parts: string[] = [];
    if (semester.status === 'vuot') {
      parts.push(`Tổng tín học kỳ là ${semester.total} TC, vượt mức tối đa ${SEMESTER_MAX} TC.`);
    } else if (semester.status === 'thieu') {
      parts.push(`Tổng tín học kỳ là ${semester.total} TC, chưa đạt mức tối thiểu ${SEMESTER_MIN} TC.`);
    } else {
      parts.push(`Tổng tín học kỳ là ${semester.total} TC, nằm trong khoảng ${SEMESTER_MIN}–${SEMESTER_MAX} TC.`);
    }
    if (overBlocks.length > 0) {
      parts.push(`Lựa chọn hiện tại chưa hợp lệ: ${overBlocks.map((b) => b.id).join(', ')} vượt số tín cho phép.`);
    } else {
      parts.push('Lựa chọn hiện tại không vượt số tín ở khối nào.');
    }
    conclusion = parts.join(' ');
  }

  // ---- Hệ quả: vượt tín, GPA, học phí, học trước ----
  const consequences: string[] = [];
  if (overBlocks.length > 0) {
    consequences.push(
      'Phần vượt tín không tính vào GPA. Không đi học sẽ bị điểm F và không được hoàn học phí. Dưới 2 tuần sẽ được rút; qua 2 tuần phải đi học bình thường. Sau khi kết thúc môn phải xin xóa tín (mất phí lần 2).',
    );
  }
  if (b2.length > 0) {
    consequences.push('Môn B2 không ảnh hưởng đến GPA và học phí.');
  }
  consequences.push(TUITION_NOTE);

  // Học trước của từng môn đang chọn
  const registeredCodes = new Set(courses.filter((s) => s.status === 'registered').map((s) => s.code));
  const completedCodes = new Set(courses.filter((s) => s.status === 'completed').map((s) => s.code));
  const selectedCodes = new Set(selected);
  const prereqs: PrereqLine[] = [];
  for (const c of pickedRows) {
    for (const p of prereqsOf(c.code, c.section)) {
      let ok = false;
      let text: string;
      if (completedCodes.has(p)) {
        ok = true;
        text = `${c.code} cần học trước ${p}: bạn đã học ${p}.`;
      } else if (registeredCodes.has(p)) {
        text = `${c.code} cần học trước ${p}: ${p} đang đăng ký, cần học đạt trước khi học ${c.code}.`;
      } else if (selectedCodes.has(p)) {
        text = `${c.code} cần học trước ${p}: ${p} đang chọn cùng học kỳ, cần xác nhận với Phòng Đào tạo.`;
      } else if (!catalog.some((x) => x.code === p)) {
        text = `${c.code} cần học trước ${p}: ${p} không có trong danh mục CTĐT đang dùng, cần kiểm tra lại với Phòng Đào tạo.`;
      } else {
        text = `${c.code} cần học trước ${p}: bạn chưa học hoặc chưa đăng ký ${p}.`;
      }
      prereqs.push({ course: c.code, prereq: p, ok, text });
    }
  }
  prereqs.sort((a, b) => a.course.localeCompare(b.course) || a.prereq.localeCompare(b.prereq));

  // ---- Gợi ý môn đăng ký lần sau ----
  // Môn có học trước là môn đã đăng ký, đã học hoặc đang chọn; chưa đăng ký; hiện đúng với sinh viên
  const relevant = new Map<string, string>();
  for (const code of completedCodes) relevant.set(code, 'đã học');
  for (const code of registeredCodes) relevant.set(code, 'đang đăng ký');
  for (const code of selectedCodes) if (!relevant.has(code)) relevant.set(code, 'đang chọn');
  const takenOrPicked = new Set([...registeredCodes, ...completedCodes, ...selectedCodes]);

  const suggestions: Suggestion[] = [];
  const seen = new Set<string>();
  for (const c of catalog) {
    if (seen.has(c.code) || takenOrPicked.has(c.code)) continue;
    if (!isCounted(c) || !isVisible(c, rules)) continue;
    if (!isOpen(c.code)) continue;
    const needs = prereqsOf(c.code, c.section);
    if (needs.length === 0) continue;
    const linked = needs.filter((p) => relevant.has(p));
    if (linked.length === 0) continue;
    seen.add(c.code);
    const linkedText = linked.map((p) => `${p} (${relevant.get(p)})`).join(', ');
    const missing = needs.filter((p) => !completedCodes.has(p));
    const reason =
      missing.length === 0
        ? `Liên quan đến ${linkedText}. Bạn đã đủ học trước.`
        : `Liên quan đến ${linkedText}. Còn cần học trước: ${missing.join(', ')}.`;
    suggestions.push({ code: c.code, name: c.name, credits: c.credits, reason });
  }
  // Gợi ý theo nhóm nội dung: môn cùng nhóm với môn đã đăng ký, đã học hoặc đang chọn
  const topicPool = new Map<string, string[]>();
  for (const code of takenOrPicked) {
    const t = COURSE_TOPICS[code];
    if (!t) continue;
    topicPool.set(t, [...(topicPool.get(t) ?? []), code]);
  }
  const byTopic: { s: Suggestion; n: number }[] = [];
  for (const c of catalog) {
    const t = COURSE_TOPICS[c.code];
    if (!t || !topicPool.has(t)) continue;
    if (seen.has(c.code) || takenOrPicked.has(c.code)) continue;
    if (!isCounted(c) || !isVisible(c, rules) || !isOpen(c.code)) continue;
    seen.add(c.code);
    const related = topicPool.get(t)!;
    const needs = prereqsOf(c.code, c.section);
    const missing = needs.filter((p) => !completedCodes.has(p));
    const reason =
      `Cùng nhóm nội dung "${t}" với ${related.join(', ')}.` +
      (missing.length > 0 ? ` Còn cần học trước: ${missing.join(', ')}.` : '');
    byTopic.push({ s: { code: c.code, name: c.name, credits: c.credits, reason }, n: related.length });
  }
  byTopic.sort((a, b) => b.n - a.n || a.s.code.localeCompare(b.s.code));
  suggestions.sort((a, b) => a.code.localeCompare(b.code));
  const topSuggestions = [...byTopic.map((x) => x.s), ...suggestions].slice(0, 8);

  // ---- Việc cần làm ----
  const nextSteps: string[] = [];
  if (!hasPick) nextSteps.push('Quay lại form 3.3 để chọn môn.');
  for (const b of overBlocks) {
    nextSteps.push(`Bỏ bớt ít nhất ${-b.remaining} TC ở khối ${b.id}.`);
  }
  if (iii2.status === 'thieu' && hasPick) {
    nextSteps.push(`Chọn thêm ${iii2.remaining} TC ở khối III.2 để đủ đúng ${iii2.required} TC.`);
  }
  if (semester.status === 'vuot') {
    nextSteps.push(`Bỏ bớt ít nhất ${semester.over} TC để tổng học kỳ không quá ${SEMESTER_MAX} TC.`);
  }
  if (semester.status === 'thieu' && hasPick) {
    nextSteps.push(`Có thể chọn thêm ${semester.missing} TC để đạt mức tối thiểu ${SEMESTER_MIN} TC.`);
  }
  for (const p of prereqs.filter((x) => !x.ok)) {
    nextSteps.push(`Kiểm tra học trước của ${p.course}: ${p.prereq}.`);
  }
  if (hasPick && overBlocks.length === 0 && semester.status !== 'vuot') {
    nextSteps.push('Kiểm tra mã lớp của từng môn trên cổng đăng ký chính thức trước khi đăng ký.');
  }
  nextSteps.push('Đối chiếu kết quả với cổng đăng ký chính thức.');

  // ---- Nguồn ----
  const sources = [
    'CTĐT ngành Ngôn ngữ Anh QH25 (danh mục môn theo khối)',
    SEMESTER_SOURCE,
    'Quyết định học phí 2026–2027 (Ngôn ngữ Anh, QH.2024–QH.2025)',
  ];
  if (overBlocks.length > 0) sources.push('Phòng Đào tạo và Người học – quy định đăng ký vượt học phần tự chọn');
  if (b2.length > 0) sources.push('Phòng Đào tạo và Người học – quy định học phần B2');
  if (prereqs.length > 0 || topSuggestions.length > 0) {
    sources.push('CTĐT ngành Ngôn ngữ Anh QH25, cột "HP học trước"');
  }

  return {
    situation,
    situationLabel: SITUATIONS.find((s) => s.id === situation)?.label ?? '',
    question,
    excludedNotOpen,
    semester,
    blocks: view.blocks,
    chosen,
    b2,
    conclusion,
    warnings,
    consequences,
    prereqs,
    suggestions: topSuggestions,
    nextSteps,
    sources,
  };
}

// Dữ liệu đã tính, gửi sang Dify để diễn đạt. Dify không tự tính số tín.
export function buildCalcPayload(result: AnalysisResult) {
  return {
    situation: result.situationLabel,
    semester: {
      registered: result.semester.registered,
      picked: result.semester.picked,
      total: result.semester.total,
      min: SEMESTER_MIN,
      max: SEMESTER_MAX,
      status: result.semester.status,
    },
    blocks: result.blocks.map((b) => ({
      id: b.id,
      required: b.required,
      done: b.done,
      picked: b.picked,
      remaining: b.remaining,
      status: b.status,
    })),
    chosen: result.chosen.map((c) => ({ code: c.code, name: c.name, credits: c.credits, block: c.block })),
    b2: result.b2.map((c) => ({ code: c.code, name: c.name, credits: c.credits })),
    excluded_not_open: result.excludedNotOpen,
    prerequisites: result.prereqs.map((p) => ({ course: p.course, prereq: p.prereq, ok: p.ok })),
    warnings: result.warnings.map((w) => ({ severity: w.severity, text: w.text })),
    consequences: result.consequences,
    suggestions: result.suggestions.map((s) => ({ code: s.code, name: s.name, reason: s.reason })),
    next_steps: result.nextSteps,
    sources: result.sources,
  };
}
