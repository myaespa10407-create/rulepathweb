// Logic form 3.3 (đăng ký môn tự chọn). Thuần, không phụ thuộc giao diện.
import {
  isCounted,
  isVisible,
  type CatalogCourse,
  type SelectedCourse,
  type StudentRules,
} from './profileLogic';

export type ElectiveBlock = 'II.2' | 'III.2' | 'IV.2.2';
export type BlockStatus = 'du' | 'thieu' | 'vuot';

const BLOCKS: ElectiveBlock[] = ['II.2', 'III.2', 'IV.2.2'];

export const BLOCK_TITLES: Record<ElectiveBlock, string> = {
  'II.2': 'Khối II.2 – Kiến thức chung theo lĩnh vực',
  'III.2': 'Khối III.2 – Kiến thức theo khối ngành',
  'IV.2.2': 'Khối IV.2.2 – Kiến thức chung theo nhóm ngành',
};

export interface BlockView {
  id: ElectiveBlock;
  title: string;
  required: number;       // X: số tín tự chọn của khối trong CTĐT
  done: number;           // tín đã đăng ký + đã học
  picked: number;         // tín đang chọn trên màn hình này
  remaining: number;      // X - done - picked; âm nghĩa là vượt
  status: BlockStatus;
  candidates: CatalogCourse[];
}

export interface ElectiveView {
  blocks: BlockView[];
  b2: CatalogCourse[];
  canContinue: boolean;
}

export function blockOf(section: string): ElectiveBlock | null {
  const m = /^(II\.2|III\.2|IV\.2\.2) /.exec(section);
  return m ? (m[1] as ElectiveBlock) : null;
}

export function requiredOf(catalog: CatalogCourse[], block: ElectiveBlock): number {
  for (const c of catalog) {
    if (blockOf(c.section) !== block) continue;
    const m = /chọn (\d+)\//.exec(c.section);
    if (m) return Number(m[1]);
  }
  return 0;
}

// Môn trong CTĐT áp dụng cho sinh viên này (lấy dòng đúng theo quy tắc)
function findCourse(catalog: CatalogCourse[], code: string, rules: StudentRules) {
  return catalog.find((c) => c.code === code && isCounted(c) && isVisible(c, rules));
}

export function blockMessage(b: BlockView): string {
  const base = `đã đăng ký/học ${b.done}, đang chọn ${b.picked}, cần ${b.required} TC`;
  if (b.status === 'vuot') return `Vượt ${-b.remaining} tín (${base}). Hãy bỏ bớt môn.`;
  if (b.status === 'du') return `Đủ ${b.required} tín (${base}).`;
  return `Còn thiếu ${b.remaining} tín (${base}). Có thể học thêm ở các năm sau.`;
}

export function buildElectiveView(args: {
  catalog: CatalogCourse[];
  courses: SelectedCourse[];      // môn đã học và đã đăng ký
  rules: StudentRules;
  selected: string[];             // môn đang chọn trên form 3.3
}): ElectiveView {
  const { catalog, courses, rules, selected } = args;
  const takenCodes = new Set(courses.map((c) => c.code));

  const blocks: BlockView[] = BLOCKS.map((id) => {
    const required = requiredOf(catalog, id);

    const done = courses.reduce((sum, s) => {
      const c = findCourse(catalog, s.code, rules);
      return c && blockOf(c.section) === id ? sum + c.credits : sum;
    }, 0);

    const picked = selected.reduce((sum, code) => {
      const c = findCourse(catalog, code, rules);
      return c && blockOf(c.section) === id ? sum + c.credits : sum;
    }, 0);

    const remaining = required - done - picked;
    const status: BlockStatus = remaining < 0 ? 'vuot' : remaining === 0 ? 'du' : 'thieu';

    const seen = new Set<string>();
    const candidates = catalog.filter((c) => {
      if (blockOf(c.section) !== id || !isCounted(c) || !isVisible(c, rules)) return false;
      if (takenCodes.has(c.code) || seen.has(c.code)) return false;
      seen.add(c.code);
      return true;
    });

    return { id, title: BLOCK_TITLES[id], required, done, picked, remaining, status, candidates };
  });

  const seenB2 = new Set<string>();
  const b2 = catalog.filter((c) => {
    if (!c.section.startsWith('I. Ngoài 129 TC') || !c.language_code) return false;
    if (!isVisible(c, rules) || takenCodes.has(c.code)) return false;
    if (seenB2.has(c.code)) return false;
    seenB2.add(c.code);
    return true;
  });

  return {
    blocks,
    b2,
    canContinue: blocks.every((b) => b.status !== 'vuot'),
  };
}
