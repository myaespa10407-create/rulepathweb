import { describe, it, expect } from 'vitest';
import { buildElectiveView, blockMessage, requiredOf } from './electiveRules';
import { COURSE_CATALOG } from '../data/courseCatalog';
import type { StudentRules, SelectedCourse } from './profileLogic';

const RULES: StudentRules = {
  level: '3',
  secondLanguage: 'FR',
  isInternational: false,
  yearOfStudy: 3,
  track: 'V.1',
};


const view = (courses: SelectedCourse[] = [], selected: string[] = []) =>
  buildElectiveView({ catalog: COURSE_CATALOG, courses, rules: RULES, selected });

describe('X tín của từng khối lấy từ CTĐT', () => {
  it('II.2 = 6, III.2 = 6, IV.2.2 = 12', () => {
    expect(requiredOf(COURSE_CATALOG, 'II.2')).toBe(6);
    expect(requiredOf(COURSE_CATALOG, 'III.2')).toBe(6);
    expect(requiredOf(COURSE_CATALOG, 'IV.2.2')).toBe(12);
  });
});

describe('loại môn đã đăng ký hoặc đã học', () => {
  it('môn đã học không còn trong danh sách chọn', () => {
    const v = view([{ code: 'FLF1010', status: 'completed', class_code: null }]);
    const ids = v.blocks.find((b) => b.id === 'II.2')!.candidates.map((c) => c.code);
    expect(ids).not.toContain('FLF1010');
    expect(ids).toContain('FLF1007');
  });

  it('môn đã đăng ký cũng không còn trong danh sách chọn', () => {
    const v = view([{ code: 'FLF1007', status: 'registered', class_code: 'FLF1007.01' }]);
    const ids = v.blocks.find((b) => b.id === 'II.2')!.candidates.map((c) => c.code);
    expect(ids).not.toContain('FLF1007');
  });

  it('hiện đủ môn trong CTĐT của khối (kể cả ENG1001B)', () => {
    const v = view();
    const ids = v.blocks.find((b) => b.id === 'II.2')!.candidates.map((c) => c.code);
    expect(ids).toHaveLength(7);
    expect(ids).toContain('ENG1001B');
  });
});

describe('tín còn thiếu tính theo cả đã đăng ký và đã học', () => {
  it('đã học 3 tín thì còn thiếu 3 tín', () => {
    const b = view([{ code: 'FLF1010', status: 'completed', class_code: null }]).blocks.find((x) => x.id === 'II.2')!;
    expect(b.done).toBe(3);
    expect(b.remaining).toBe(3);
    expect(b.status).toBe('thieu');
    expect(blockMessage(b)).toContain('Còn thiếu 3 tín');
  });

  it('đã đăng ký 3 + đang chọn 3 = đủ 6', () => {
    const v = view(
      [{ code: 'FLF1010', status: 'registered', class_code: 'FLF1010.01' }],
      ['FLF1007'],
    );
    const b = v.blocks.find((x) => x.id === 'II.2')!;
    expect(b.status).toBe('du');
    expect(v.canContinue).toBe(true);
  });
});

describe('không bắt buộc đủ X tín, chỉ chặn khi vượt', () => {
  it('chưa chọn gì vẫn được tiếp tục', () => {
    expect(view().canContinue).toBe(true);
  });

  it('chọn lẻ, thiếu tín vẫn được tiếp tục', () => {
    expect(view([], ['FLF1010']).canContinue).toBe(true);
  });

  it('vượt X tín thì không được tiếp tục', () => {
    const v = view([], ['FLF1010', 'FLF1007', 'FLF1016']); // 9 tín > 6
    const b = v.blocks.find((x) => x.id === 'II.2')!;
    expect(b.status).toBe('vuot');
    expect(v.canContinue).toBe(false);
    expect(blockMessage(b)).toContain('Vượt 3 tín');
  });

  it('đã học + chọn thêm vượt X thì chặn', () => {
    const v = view([{ code: 'FLF1010', status: 'completed', class_code: null }], ['FLF1007', 'FLF1016']);
    expect(v.canContinue).toBe(false);
  });
});

describe('B2 không tính vào khối', () => {
  it('B2 hiện ở mục riêng và bỏ môn đã học', () => {
    const v = view([{ code: 'FLF1308B', status: 'completed', class_code: null }]);
    expect(v.b2.map((c) => c.code)).not.toContain('FLF1308B');
    expect(v.b2.map((c) => c.code)).toContain('FLF1408B');
    expect(v.blocks.every((b) => b.candidates.every((c) => c.code !== 'FLF1308B'))).toBe(true);
  });
});
