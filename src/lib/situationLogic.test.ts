import { describe, it, expect } from 'vitest';
import {
  UPDATE_LATER,
  canContinue,
  needsSituationHint,
  situationNotice,
  summaryLine,
} from './situationLogic';

describe('situationNotice', () => {
  it('rút học phần và học lại/GPA hiện "cập nhật sau"', () => {
    expect(situationNotice('WITHDRAW')).toBe(UPDATE_LATER);
    expect(situationNotice('RETAKE_GPA')).toBe(UPDATE_LATER);
  });

  it('đăng ký môn tự chọn không có thông báo', () => {
    expect(situationNotice('ELECTIVE')).toBeNull();
    expect(situationNotice(null)).toBeNull();
  });
});

describe('canContinue', () => {
  it('chỉ đăng ký môn tự chọn được đi tiếp', () => {
    expect(canContinue('ELECTIVE')).toBe(true);
    expect(canContinue('WITHDRAW')).toBe(false);
    expect(canContinue('RETAKE_GPA')).toBe(false);
    expect(canContinue(null)).toBe(false);
  });
});

describe('summaryLine', () => {
  it('ghi đủ 6 trường với nhãn tiếng Việt', () => {
    const line = summaryLine({
      major: 'NNA',
      cohort: 'QH25',
      track: 'THUONG',
      semester: '1',
      level: '3',
      year: '2026-2027',
    });
    expect(line).toContain('Ngành: Ngôn ngữ Anh');
    expect(line).toContain('Bậc: Bậc 3');
    expect(line).toContain('Năm học: 2026-2027 (26-27)');
  });
});

describe('needsSituationHint', () => {
  it('có câu hỏi nhưng chưa chọn tình huống thì hiện nhắc', () => {
    expect(needsSituationHint(null, 'Tôi hỏi gì đó')).toBe(true);
  });

  it('không hiện nhắc khi chưa có câu hỏi hoặc đã chọn tình huống', () => {
    expect(needsSituationHint(null, '   ')).toBe(false);
    expect(needsSituationHint(null, '')).toBe(false);
    expect(needsSituationHint('WITHDRAW', 'abc')).toBe(false);
    expect(needsSituationHint('ELECTIVE', 'abc')).toBe(false);
  });
});
