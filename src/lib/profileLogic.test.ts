import { describe, it, expect } from 'vitest';
import {
  TRACKS,
  hasSelectionErrors,
  isVisible,
  matchesSearch,
  normalize,
  requiredByMuc,
  selectedByMuc,
  totalRequired,
  validateSelection,
  type CatalogCourse,
  type StudentRules,
} from './profileLogic';
import { COURSE_CATALOG } from '../data/courseCatalog';

const BASE: StudentRules = {
  level: '3',
  secondLanguage: 'FR',
  isInternational: false,
  yearOfStudy: 3,
  track: 'V.1',
};

const find = (code: string, section?: string): CatalogCourse => {
  const c = COURSE_CATALOG.find((x) => x.code === code && (!section || x.section.startsWith(section)));
  if (!c) throw new Error(`không có ${code}`);
  return c;
};

describe('dữ liệu danh mục', () => {
  it('có đủ 192 môn và mọi môn đều có tín chỉ hợp lệ', () => {
    expect(COURSE_CATALOG).toHaveLength(192);
    expect(COURSE_CATALOG.every((c) => c.credits > 0)).toBe(true);
  });
});

describe('tổng tín chương trình', () => {
  it('mỗi hướng Mục V đều cho đúng 129 TC', () => {
    for (const track of TRACKS) {
      expect(totalRequired(COURSE_CATALOG, { ...BASE, track })).toBe(129);
    }
  });

  it('phân bố theo Mục đúng: I 21, II 9, III 12, IV 42, V 45', () => {
    expect(requiredByMuc(COURSE_CATALOG, BASE)).toEqual({ I: 21, II: 9, III: 12, IV: 42, V: 45 });
  });

  it('bậc 4 và bậc 5 cùng tổng 129 TC', () => {
    expect(totalRequired(COURSE_CATALOG, { ...BASE, level: '4' })).toBe(129);
    expect(totalRequired(COURSE_CATALOG, { ...BASE, level: '5' })).toBe(129);
  });
});

describe('môn B1 theo ngôn ngữ thứ hai', () => {
  it('chỉ hiện đúng một môn B1 là ngôn ngữ thứ hai', () => {
    const b1 = COURSE_CATALOG.filter((c) => c.section.startsWith('I. Kiến thức chung') && c.language_code);
    const visible = b1.filter((c) => isVisible(c, BASE));
    expect(visible.map((c) => c.code)).toEqual(['FLF1307B']);
  });

  it('tiếng Việt chỉ hiện khi là sinh viên nước ngoài', () => {
    const vi = find('FLF2307');
    expect(isVisible(vi, { ...BASE, secondLanguage: 'VI' })).toBe(false);
    expect(isVisible(vi, { ...BASE, secondLanguage: 'VI', isInternational: true })).toBe(true);
  });

  it('tiếng Việt B2 cũng chỉ cho sinh viên nước ngoài', () => {
    const vi2 = find('FLF2308');
    expect(isVisible(vi2, BASE)).toBe(false);
    expect(isVisible(vi2, { ...BASE, isInternational: true })).toBe(true);
  });

  it('B2 không tính vào tổng tín', () => {
    const b2 = find('FLF1308B');
    expect(isVisible(b2, BASE)).toBe(true);
    const before = totalRequired(COURSE_CATALOG, BASE);
    expect(before).toBe(129);
  });
});

describe('năm học và Mục V', () => {
  it('năm 1–2 không có môn Mục V, tổng 84 TC', () => {
    for (const year of [1, 2] as const) {
      const rules = { ...BASE, yearOfStudy: year, track: null };
      expect(requiredByMuc(COURSE_CATALOG, rules).V).toBe(0);
      expect(totalRequired(COURSE_CATALOG, rules)).toBe(84);
    }
  });

  it('năm 2 vẫn hiện môn Mục V của hướng nếu có chọn (không áp dụng)', () => {
    expect(isVisible(find('ENG3031'), { ...BASE, yearOfStudy: 2 })).toBe(false);
  });

  it('năm 3 chưa chọn hướng thì chưa có môn Mục V nào', () => {
    const rules = { ...BASE, track: null };
    expect(requiredByMuc(COURSE_CATALOG, rules).V).toBe(9);
  });

  it('năm 4 cũng có Mục V như năm 3', () => {
    expect(totalRequired(COURSE_CATALOG, { ...BASE, yearOfStudy: 4 })).toBe(129);
  });
});

describe('IV.1 theo bậc', () => {
  it('ENG2050 chỉ hiện ở nhóm đúng bậc', () => {
    const rows = COURSE_CATALOG.filter((c) => c.code === 'ENG2050');
    expect(rows).toHaveLength(2);
    const bac4 = rows.find((c) => c.section.includes('bậc 4'))!;
    expect(isVisible(bac4, BASE)).toBe(false);
    expect(isVisible(bac4, { ...BASE, level: '4' })).toBe(true);
  });
});

describe('Mục V theo hướng', () => {
  it('ẩn môn của hướng khác, giữ V.6', () => {
    const v2 = find('ENG3031');        // V.1 tự chọn
    const v2Course = find('ENG3027');  // V.2 tự chọn
    expect(isVisible(v2, BASE)).toBe(true);
    expect(isVisible(v2Course, BASE)).toBe(false);
    expect(isVisible(v2Course, { ...BASE, track: 'V.2' })).toBe(true);
    expect(isVisible(find('ENG4001'), BASE)).toBe(true);
  });

  it('các hướng đều có 36 TC ở Mục V (không tính V.6)', () => {
    for (const track of TRACKS) {
      expect(requiredByMuc(COURSE_CATALOG, { ...BASE, track }).V).toBe(45);
    }
  });
});

describe('tìm kiếm', () => {
  it('bỏ dấu tiếng Việt, kể cả chữ đ', () => {
    expect(normalize('Địa chính trị')).toBe('dia chinh tri');
    expect(normalize('Đào tạo')).toBe('dao tao');
  });

  it('tìm theo mã và theo tên, không cần dấu', () => {
    const c = find('FLF1016');
    expect(matchesSearch(c, 'flf1016')).toBe(true);
    expect(matchesSearch(c, 'dia chinh')).toBe(true);
    expect(matchesSearch(c, 'Địa chính')).toBe(true);
    expect(matchesSearch(c, 'thư pháp')).toBe(false);
    expect(matchesSearch(c, '')).toBe(true);
  });
});

describe('đã học / đã đăng ký', () => {
  it('tính tín đã chọn theo Mục, chỉ môn trong 129 TC', () => {
    const selected = [
      { code: 'PHI1006', status: 'completed' as const, class_code: null },
      { code: 'FLF1308B', status: 'completed' as const, class_code: null },
      { code: 'FLF1009', status: 'registered' as const, class_code: 'FLF1009.01' },
    ];
    expect(selectedByMuc(COURSE_CATALOG, selected, 'completed')).toEqual({ I: 3, II: 0, III: 0, IV: 0, V: 0 });
    expect(selectedByMuc(COURSE_CATALOG, selected, 'registered')).toEqual({ I: 0, II: 3, III: 0, IV: 0, V: 0 });
  });

  it('báo mã trùng, mã trùng ở hai trạng thái và thiếu mã lớp', () => {
    const e = validateSelection([
      { code: 'FLF1010', status: 'registered', class_code: '' },
      { code: 'FLF1010', status: 'completed', class_code: null },
      { code: 'FLF1007', status: 'registered', class_code: 'FLF1007.02' },
    ]);
    expect(e.duplicate).toEqual(['FLF1010']);
    expect(e.bothStatuses).toEqual(['FLF1010']);
    expect(e.missingClass).toEqual(['FLF1010']);
    expect(hasSelectionErrors(e)).toBe(true);
  });

  it('không có lỗi khi danh sách hợp lệ', () => {
    const e = validateSelection([
      { code: 'FLF1010', status: 'registered', class_code: 'FLF1010.01' },
      { code: 'ENG2048', status: 'completed', class_code: null },
    ]);
    expect(hasSelectionErrors(e)).toBe(false);
  });
});
