import { describe, it, expect } from 'vitest';
import { semesterStatus, semesterView, creditOf, SEMESTER_MIN, SEMESTER_MAX } from './semesterRules';
import type { CatalogCourse } from './profileLogic';

const course = (code: string, credits: number, section = 'II.2 Tự chọn – chọn 6/21 TC'): CatalogCourse => ({
  code,
  name: code,
  credits,
  category: 'Tự chọn',
  section,
  muc: 'II',
  starred: false,
  language_code: null,
});

const CATALOG: CatalogCourse[] = [
  course('A1', 3),
  course('A2', 3),
  course('A3', 3),
  course('B1X', 5, 'I. Ngoài 129 TC – B2 tự chọn'),
  course('OUT', 4, 'Ngoài 129 TC – thử nghiệm'),
];

describe('quy tắc 14–55 TC mỗi học kỳ', () => {
  it('có đúng mức 14 và 55', () => {
    expect(SEMESTER_MIN).toBe(14);
    expect(SEMESTER_MAX).toBe(55);
  });

  it('phân loại thiếu, đủ, vượt đúng ở các biên', () => {
    expect(semesterStatus(0)).toBe('thieu');
    expect(semesterStatus(13)).toBe('thieu');
    expect(semesterStatus(14)).toBe('ok');
    expect(semesterStatus(55)).toBe('ok');
    expect(semesterStatus(56)).toBe('vuot');
  });
});

describe('semesterView', () => {
  it('cộng tín đang chọn và tín đã đăng ký trong học kỳ', () => {
    const v = semesterView({
      catalog: CATALOG,
      courses: [{ code: 'A1', status: 'registered', class_code: 'A1.01' }],
      selected: ['A2'],
    });
    expect(v.registered).toBe(3);
    expect(v.picked).toBe(3);
    expect(v.total).toBe(6);
    expect(v.status).toBe('thieu');
    expect(v.missing).toBe(8);
    expect(v.over).toBe(0);
  });

  it('không tính môn đã học ở học kỳ trước', () => {
    const v = semesterView({
      catalog: CATALOG,
      courses: [{ code: 'A1', status: 'completed', class_code: null }],
      selected: [],
    });
    expect(v.total).toBe(0);
  });

  it('không cộng hai lần khi môn vừa đã đăng ký vừa nằm trong danh sách chọn', () => {
    const v = semesterView({
      catalog: CATALOG,
      courses: [{ code: 'A1', status: 'registered', class_code: 'A1.01' }],
      selected: ['A1'],
    });
    expect(v.total).toBe(3);
  });

  it('không tính môn B2 vào tổng học kỳ', () => {
    const v = semesterView({ catalog: CATALOG, courses: [], selected: ['B1X'] });
    expect(v.picked).toBe(0);
    expect(v.total).toBe(0);
  });

  it('không tính môn đã đăng ký là B2', () => {
    const v = semesterView({
      catalog: CATALOG,
      courses: [{ code: 'B1X', status: 'registered', class_code: 'B1X.01' }],
      selected: ['A1'],
    });
    expect(v.registered).toBe(0);
    expect(v.total).toBe(3);
  });

  it('báo vượt khi tổng lớn hơn 55', () => {
    const many = Array.from({ length: 19 }, (_, i) => course(`M${i}`, 3));
    const v = semesterView({
      catalog: many,
      courses: [],
      selected: many.map((c) => c.code),
    });
    expect(v.total).toBe(57);
    expect(v.status).toBe('vuot');
    expect(v.over).toBe(2);
  });

  it('creditOf trả 0 cho môn ngoài 129 TC và môn B2', () => {
    expect(creditOf(CATALOG, 'OUT')).toBe(0);
    expect(creditOf(CATALOG, 'B1X')).toBe(0);
    expect(creditOf(CATALOG, 'A1')).toBe(3);
  });
});
