import { describe, it, expect } from 'vitest';
import { buildAnalysis, buildCalcPayload } from './analysisLogic';
import { COURSE_CATALOG } from '../data/courseCatalog';
import { isCounted, isVisible, type StudentRules, type SelectedCourse } from './profileLogic';

const RULES: StudentRules = {
  level: '3',
  secondLanguage: 'FR',
  isInternational: false,
  yearOfStudy: 3,
  track: 'V.1',
};

const run = (selected: string[] = [], courses: SelectedCourse[] = [], question = '') =>
  buildAnalysis({
    catalog: COURSE_CATALOG,
    courses,
    rules: RULES,
    selected,
    situation: 'ELECTIVE',
    question,
  });

describe('form 3.1.1: chưa chọn môn', () => {
  it('kết luận yêu cầu chọn môn, không có cảnh báo nghiêm trọng', () => {
    const r = run();
    expect(r.conclusion).toContain('chưa chọn môn nào');
    expect(r.chosen).toEqual([]);
    expect(r.warnings.some((w) => w.severity === 'nghiem_trong')).toBe(false);
    expect(r.nextSteps[0]).toContain('form 3.3');
  });

  it('khối chưa đủ chỉ là lưu ý, không phải lỗi', () => {
    const r = run();
    expect(r.blocks.every((b) => b.status === 'thieu')).toBe(true);
    expect(r.warnings.every((w) => w.severity === 'luu_y')).toBe(true);
  });
});

describe('form 3.1.1: vượt số tín', () => {
  // II.2 cho 6 TC; chọn 9 TC
  const r = run(['FLF1010', 'FLF1007', 'FLF1016']);
  const b = r.blocks.find((x) => x.id === 'II.2')!;

  it('báo vượt đúng số tín và có cảnh báo nghiêm trọng', () => {
    expect(b.status).toBe('vuot');
    const w = r.warnings.find((x) => x.severity === 'nghiem_trong');
    expect(w?.text).toContain('vượt 3 TC');
    expect(w?.source).toContain('BR-01');
  });

  it('kết luận nêu khối vượt và hướng dẫn bỏ bớt', () => {
    expect(r.conclusion).toContain('chưa hợp lệ');
    expect(r.conclusion).toContain('II.2');
    expect(r.nextSteps).toContain('Bỏ bớt ít nhất 3 TC ở khối II.2.');
  });

  it('nêu hệ quả BR-02 và có nguồn tương ứng', () => {
    expect(r.consequences.some((t) => t.includes('điểm F'))).toBe(true);
    expect(r.sources.some((s) => s.includes('BR-02'))).toBe(true);
  });
});

describe('form 3.1.1: đủ số tín', () => {
  it('III.2 vượt 6 TC vẫn đưa vào kết quả và có cảnh báo nghiêm trọng, không khóa', () => {
    const iii2 = COURSE_CATALOG.filter(
      (c) => c.section.startsWith('III.2') && isCounted(c) && isVisible(c, RULES),
    );
    const picks: string[] = [];
    let sum = 0;
    for (const c of iii2) {
      if (picks.includes(c.code)) continue;
      picks.push(c.code);
      sum += c.credits;
      if (sum > 6) break;
    }
    const r = run(picks);
    const b = r.blocks.find((x) => x.id === 'III.2')!;
    expect(b.status).toBe('vuot');
    expect(r.warnings.some((w) => w.severity === 'nghiem_trong' && w.text.includes('III.2'))).toBe(true);
  });

  it('III.2 thiếu so với 6 TC chỉ là lưu ý và nêu số TC cần đủ', () => {
    const r = run(['FLF1055']);
    const w = r.warnings.find((x) => x.text.includes('đúng 6 TC') && x.text.includes('thiếu'));
    expect(w?.severity).toBe('luu_y');
    expect(w?.text).toContain('còn thiếu 3 TC');
  });

  it('chọn đủ 6 TC khối II.2 thì khối đủ, không có cảnh báo vượt', () => {
    const r = run(['FLF1010', 'FLF1007']);
    expect(r.blocks.find((x) => x.id === 'II.2')!.status).toBe('du');
    expect(r.warnings.some((w) => w.severity === 'nghiem_trong')).toBe(false);
    expect(r.conclusion).toContain('không vượt');
    expect(r.chosen.map((c) => c.code).sort()).toEqual(['FLF1007', 'FLF1010']);
  });
});

describe('form 3.1.1: tín đã học và đã đăng ký được tính', () => {
  it('môn đã học 3 TC cộng với môn đang chọn 3 TC thành đủ 6', () => {
    const r = run(['FLF1007'], [{ code: 'FLF1010', status: 'completed', class_code: null }]);
    const b = r.blocks.find((x) => x.id === 'II.2')!;
    expect(b.done).toBe(3);
    expect(b.picked).toBe(3);
    expect(b.status).toBe('du');
  });
});

describe('form 3.1.1: học phần B2', () => {
  it('B2 tách riêng, không vào khối tự chọn, có lưu ý không tính GPA', () => {
    const b2 = COURSE_CATALOG.find(
      (c) => c.section.startsWith('I. Ngoài 129 TC') && c.language_code && isVisible(c, RULES),
    )!;
    const r = run([b2.code]);
    expect(r.b2.map((c) => c.code)).toEqual([b2.code]);
    expect(r.chosen).toEqual([]);
    expect(r.blocks.every((b) => b.picked === 0)).toBe(true);
    expect(r.warnings.some((w) => w.text.includes('GPA') && w.source.includes('BR-03'))).toBe(true);
  });
});

describe('form 3.1.1: tình huống và câu hỏi', () => {
  it('ghi nhãn tình huống và giữ nguyên câu hỏi', () => {
    const r = run([], [], 'Tôi có được học vượt không?');
    expect(r.situationLabel).toBe('Đăng ký môn tự chọn');
    expect(r.question).toBe('Tôi có được học vượt không?');
  });
});

describe('form 3.3.1: tổng tín học kỳ 14–55 TC', () => {
  it('dưới 14 TC: chỉ là lưu ý, nêu số TC còn thiếu và nguồn Phòng Đào tạo', () => {
    const r = run(['FLF1010', 'FLF1007', 'FLF1016']);
    expect(r.semester.total).toBe(9);
    const w = r.warnings.find((x) => x.text.includes('tối thiểu 14'));
    expect(w?.severity).toBe('luu_y');
    expect(w?.text).toContain('còn thiếu 5 TC');
    expect(w?.source).toContain('Phòng Đào tạo');
  });

  it('trên 55 TC: cảnh báo nghiêm trọng và yêu cầu bỏ bớt', () => {
    const codes: string[] = [];
    let sum = 0;
    for (const c of COURSE_CATALOG) {
      if (!isCounted(c) || !isVisible(c, RULES) || codes.includes(c.code)) continue;
      codes.push(c.code);
      sum += c.credits;
      if (sum >= 56) break;
    }
    const r = run(codes);
    expect(r.semester.status).toBe('vuot');
    expect(r.warnings.some((w) => w.severity === 'nghiem_trong' && w.text.includes('vượt'))).toBe(true);
    expect(r.conclusion).toContain('vượt mức tối đa 55 TC');
    expect(r.nextSteps.some((t) => t.startsWith('Bỏ bớt ít nhất'))).toBe(true);
  });

  it('tín đã đăng ký trong học kỳ được cộng vào tổng', () => {
    const r = run(['FLF1010'], [{ code: 'FLF1007', status: 'registered', class_code: 'FLF1007.01' }]);
    expect(r.semester.registered).toBe(3);
    expect(r.semester.total).toBe(6);
  });
});

describe('form 3.3.1: học trước', () => {
  it('môn cần học trước chưa học thì báo chưa đạt', () => {
    const r = run(['ENG2053']);
    const line = r.prereqs.find((p) => p.course === 'ENG2053');
    expect(line?.prereq).toBe('ENG2051');
    expect(line?.ok).toBe(false);
    expect(line?.text).toContain('chưa học hoặc chưa đăng ký');
  });

  it('đã học học trước thì đạt', () => {
    const r = run(['ENG2053'], [{ code: 'ENG2051', status: 'completed', class_code: null }]);
    expect(r.prereqs.find((p) => p.course === 'ENG2053')?.ok).toBe(true);
  });

  it('học trước đang đăng ký thì chưa tính là đạt', () => {
    const r = run(['ENG2053'], [{ code: 'ENG2051', status: 'registered', class_code: 'ENG2051.01' }]);
    const line = r.prereqs.find((p) => p.course === 'ENG2053');
    expect(line?.ok).toBe(false);
    expect(line?.text).toContain('đang đăng ký');
  });
});

describe('form 3.3.1: gợi ý môn lần sau', () => {
  it('gợi ý môn có học trước là môn đã học, không gợi ý môn đã chọn', () => {
    const done = [{ code: 'ENG2051', status: 'completed' as const, class_code: null }];
    const r = run([], done);
    expect(r.suggestions.map((s) => s.code)).toContain('ENG2053');
    expect(r.suggestions.find((s) => s.code === 'ENG2053')?.reason).toContain('ENG2051 (đã học)');

    const r2 = run(['ENG2053'], done);
    expect(r2.suggestions.map((s) => s.code)).not.toContain('ENG2053');
  });
});

describe('form 3.3.1: hệ quả GPA và học phí', () => {
  it('luôn có dòng học phí và nêu chưa có quy định GPA cho môn tự chọn', () => {
    const r = run(['FLF1010']);
    expect(r.consequences.some((t) => t.includes('3.800.000'))).toBe(true);
    expect(r.consequences.some((t) => t.includes('GPA') && t.includes('cần xác nhận'))).toBe(true);
  });
});

describe('form 3.3.1: chỉ môn đang mở đăng ký trong TKB chung', () => {
  const runOpen = (selected: string[], open: string[], courses: SelectedCourse[] = []) =>
    buildAnalysis({
      catalog: COURSE_CATALOG,
      courses,
      rules: RULES,
      selected,
      situation: 'ELECTIVE',
      question: '',
      openCodes: new Set(open),
    });

  it('môn đã chọn nhưng chưa mở thì không đưa vào kết quả và có cảnh báo', () => {
    const r = runOpen(['FLF1010'], []);
    expect(r.chosen).toEqual([]);
    expect(r.excludedNotOpen).toEqual(['FLF1010']);
    expect(r.warnings.some((w) => w.text.includes('FLF1010') && w.text.includes('chưa có lớp mở'))).toBe(true);
    expect(r.semester.picked).toBe(0);
  });

  it('gợi ý chỉ gồm môn đang mở', () => {
    const done = [{ code: 'ENG2051', status: 'completed' as const, class_code: null }];
    const r = runOpen([], ['ENG2051'], done);
    expect(r.suggestions).toEqual([]);
    const r2 = runOpen([], ['ENG2051', 'ENG2053'], done);
    expect(r2.suggestions.map((s) => s.code)).toContain('ENG2053');
  });

  it('không truyền danh sách mở thì không lọc', () => {
    const r = run(['FLF1010']);
    expect(r.chosen.map((c) => c.code)).toEqual(['FLF1010']);
    expect(r.excludedNotOpen).toEqual([]);
  });
});

describe('dữ liệu gửi sang Dify', () => {
  it('chứa số tín đã tính, cảnh báo và nguồn; không chứa dữ liệu thô của catalog', () => {
    const r = run(['FLF1010']);
    const payload = buildCalcPayload(r);
    expect(payload.semester.total).toBe(r.semester.total);
    expect(payload.semester.min).toBe(14);
    expect(payload.semester.max).toBe(55);
    expect(payload.warnings.length).toBe(r.warnings.length);
    expect(payload.sources).toEqual(r.sources);
    expect(JSON.stringify(payload)).not.toContain('courses');
  });
});
