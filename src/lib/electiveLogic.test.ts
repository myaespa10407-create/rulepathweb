import { describe, it, expect } from 'vitest';
import {
  BLOCKS,
  COURSES,
  blockCredits,
  blockMessage,
  blockStatus,
  coursesOf,
  isSelectionComplete,
  toggleCourse,
} from './electiveLogic';

describe('dữ liệu môn tự chọn', () => {
  it('mã học phần không trùng lặp', () => {
    const codes = COURSES.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('số môn mỗi khối khớp với TKB HK1 đã đối chiếu', () => {
    expect(coursesOf('II.2')).toHaveLength(6);
    expect(coursesOf('III.2')).toHaveLength(12);
    expect(coursesOf('IV.2.2')).toHaveLength(5);
  });

  it('môn FLF1055 (không mở lớp) và FLF1009 (bắt buộc) không có trong danh sách', () => {
    const codes = COURSES.map((c) => c.code);
    expect(codes).not.toContain('FLF1055');
    expect(codes).not.toContain('FLF1009');
  });
});

describe('blockCredits và trạng thái khối', () => {
  it('chỉ cộng tín của đúng khối', () => {
    expect(blockCredits(['FLF1010', 'FLF1007', 'FLF1059'], 'II.2')).toBe(6);
    expect(blockCredits(['FLF1010', 'FLF1007', 'FLF1059'], 'III.2')).toBe(3);
  });

  it('B2 không được tính vào khối nào', () => {
    const selected = ['FLF1308B'];
    for (const b of BLOCKS) expect(blockCredits(selected, b.id)).toBe(0);
  });

  it('trạng thái: đúng, thiếu, vượt theo X tín', () => {
    expect(blockStatus(6, 6)).toBe('ok');
    expect(blockStatus(3, 6)).toBe('thieu');
    expect(blockStatus(9, 6)).toBe('vuot');
  });

  it('thông báo thể hiện số tín còn thiếu hoặc vượt', () => {
    expect(blockMessage(6, 6)).toMatch(/Đủ/);
    expect(blockMessage(3, 6)).toMatch(/thiếu 3 tín/);
    expect(blockMessage(9, 6)).toMatch(/Vượt 3 tín/);
  });
});

describe('isSelectionComplete', () => {
  const full = [
    'FLF1010', 'FLF1007', // II.2: 6
    'FLF1059', 'VLF1053', // III.2: 6
    'ENG3029', 'ENG3070', 'ENG2072', 'ENG3073', // IV.2.2: 12
  ];

  it('đủ đúng X tín ở cả ba khối thì hoàn tất', () => {
    expect(isSelectionComplete(full)).toBe(true);
  });

  it('thiếu một khối thì chưa hoàn tất', () => {
    expect(isSelectionComplete(full.filter((c) => c !== 'ENG3073'))).toBe(false);
  });

  it('vượt một khối thì chưa hoàn tất', () => {
    expect(isSelectionComplete([...full, 'FLF1016'])).toBe(false);
  });

  it('chưa chọn gì thì chưa hoàn tất', () => {
    expect(isSelectionComplete([])).toBe(false);
  });

  it('môn B2 thêm vào không làm thay đổi kết quả hoàn tất', () => {
    expect(isSelectionComplete([...full, 'FLF1308B'])).toBe(true);
  });
});

describe('toggleCourse', () => {
  it('chọn rồi bỏ chọn cùng một môn', () => {
    const once = toggleCourse([], 'FLF1010');
    expect(once).toEqual(['FLF1010']);
    expect(toggleCourse(once, 'FLF1010')).toEqual([]);
  });
});
