import { describe, it, expect } from 'vitest';
import {
  inputFromRow,
  isProfileComplete,
  rowPatchFromInput,
  rulesFromInput,
  toFormValues,
  validateProfileInput,
  type ProfileInput,
  type ProfileRow,
} from './profileLogic';

const VALID: ProfileInput = {
  major: 'NNA',
  cohort: 'QH25',
  track: 'THUONG',
  semester: '1',
  level: '3',
  schoolYear: '2026-2027',
  yearOfStudy: 2,
  isInternational: false,
  secondLanguage: 'FR',
  muc5Track: null,
};

describe('validateProfileInput', () => {
  it('hợp lệ với sinh viên năm 2', () => {
    expect(validateProfileInput(VALID)).toEqual({});
    expect(isProfileComplete(VALID)).toBe(true);
  });

  it('bắt buộc ngôn ngữ thứ hai', () => {
    const e = validateProfileInput({ ...VALID, secondLanguage: null });
    expect(e.secondLanguage).toContain('bắt buộc');
  });

  it('tiếng Việt chỉ cho sinh viên nước ngoài', () => {
    expect(validateProfileInput({ ...VALID, secondLanguage: 'VI' }).secondLanguage).toBeDefined();
    expect(validateProfileInput({ ...VALID, secondLanguage: 'VI', isInternational: true })).toEqual({});
  });

  it('năm 3 trở lên bắt buộc chọn hướng Mục V', () => {
    const y3 = { ...VALID, yearOfStudy: 3 as const };
    expect(validateProfileInput(y3).muc5Track).toBeDefined();
    expect(validateProfileInput({ ...y3, muc5Track: 'V.2' })).toEqual({});
  });

  it('năm 2 không cần hướng Mục V', () => {
    expect(validateProfileInput(VALID).muc5Track).toBeUndefined();
  });

  it('chặn hệ BRT và học kỳ 2 như form cũ', () => {
    expect(validateProfileInput({ ...VALID, track: 'BRT' }).track).toBeDefined();
    expect(validateProfileInput({ ...VALID, semester: '2' }).semester).toBeDefined();
  });

  it('thiếu bậc hoặc năm học thì báo lỗi', () => {
    expect(validateProfileInput({ ...VALID, level: null }).level).toBeDefined();
    expect(validateProfileInput({ ...VALID, yearOfStudy: null }).yearOfStudy).toBeDefined();
    expect(isProfileComplete({ ...VALID, yearOfStudy: null })).toBe(false);
  });
});

describe('ghi xuống database', () => {
  it('năm 2 luôn không có hướng, dù giao diện còn giữ giá trị', () => {
    const patch = rowPatchFromInput({ ...VALID, muc5Track: 'V.1' });
    expect(patch.muc5_track).toBeNull();
    expect(patch.year_of_study).toBe(2);
  });

  it('năm 3 giữ hướng đã chọn', () => {
    const patch = rowPatchFromInput({ ...VALID, yearOfStudy: 3, muc5Track: 'V.4' });
    expect(patch.muc5_track).toBe('V.4');
  });

  it('ngôn ngữ thứ nhất luôn là EN và tên cột đúng với database', () => {
    const patch = rowPatchFromInput(VALID);
    expect(patch.first_language).toBe('EN');
    expect(patch.school_year).toBe('2026-2027');
    expect(patch.second_language).toBe('FR');
  });
});

describe('đọc từ database', () => {
  const row: ProfileRow = {
    id: 'u1',
    username: 'test_01',
    major: 'NNA',
    cohort: 'QH25',
    track: 'THUONG',
    semester: '1',
    level: '4',
    school_year: '2026-2027',
    year_of_study: 3,
    is_international: true,
    first_language: 'EN',
    second_language: 'VI',
    muc5_track: 'V.3',
  };

  it('chuyển dòng database thành dữ liệu form', () => {
    const input = inputFromRow(row);
    expect(input.level).toBe('4');
    expect(input.yearOfStudy).toBe(3);
    expect(input.isInternational).toBe(true);
    expect(input.muc5Track).toBe('V.3');
    expect(isProfileComplete(input)).toBe(true);
  });

  it('hồ sơ mới (chưa điền) không đầy đủ', () => {
    const empty = inputFromRow({ ...row, level: null, year_of_study: null, second_language: null, muc5_track: null });
    expect(isProfileComplete(empty)).toBe(false);
  });
});

describe('quy tắc và tóm tắt', () => {
  it('rulesFromInput dùng đúng năm và hướng', () => {
    const rules = rulesFromInput({ ...VALID, yearOfStudy: 4, muc5Track: 'V.5' });
    expect(rules.yearOfStudy).toBe(4);
    expect(rules.track).toBe('V.5');
    expect(rules.secondLanguage).toBe('FR');
  });

  it('toFormValues trả về đủ 6 trường cho form 2', () => {
    expect(toFormValues(VALID)).toEqual({
      major: 'NNA',
      cohort: 'QH25',
      track: 'THUONG',
      semester: '1',
      level: '3',
      year: '2026-2027',
    });
  });
});
