import { describe, it, expect } from 'vitest';
import { validateForm, getCourseGroup, totalCredits } from './formLogic';

const VALID = {
  major: 'NNA',
  cohort: 'QH25',
  track: 'THUONG',
  semester: '1',
  level: '3',
  year: '2026-2027',
};

describe('validateForm', () => {
  it('form hợp lệ thì đi tiếp được', () => {
    const r = validateForm(VALID);
    expect(r.canProceed).toBe(true);
    expect(r.errors).toEqual({});
  });

  it('hệ BRT bị chặn', () => {
    const r = validateForm({ ...VALID, track: 'BRT' });
    expect(r.canProceed).toBe(false);
    expect(r.blockers[0]).toMatch(/chưa được cập nhật/);
  });

  it('học kỳ 2 bị chặn', () => {
    const r = validateForm({ ...VALID, semester: '2' });
    expect(r.canProceed).toBe(false);
    expect(r.blockers[0]).toMatch(/chưa có thông tin/);
  });

  it('thiếu năm học thì báo lỗi đúng trường', () => {
    const { year: _year, ...rest } = VALID;
    const r = validateForm(rest);
    expect(r.errors.year).toBeDefined();
    expect(Object.keys(r.errors)).toHaveLength(1);
  });

  it('giá trị không có trong danh sách bị báo lỗi', () => {
    expect(validateForm({ ...VALID, level: '6' }).errors.level).toMatch(/không hợp lệ/);
  });
});

describe('getCourseGroup', () => {
  it('mỗi bậc có 6 học phần, tổng 18 TC', () => {
    for (const level of ['3', '4', '5']) {
      const group = getCourseGroup(level)!;
      expect(group).toHaveLength(6);
      expect(totalCredits(group)).toBe(18);
    }
  });

  it('bậc không hợp lệ trả về null', () => {
    expect(getCourseGroup('6')).toBeNull();
  });
});