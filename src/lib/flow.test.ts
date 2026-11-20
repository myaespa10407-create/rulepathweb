import { describe, it, expect } from 'vitest';
import { flowReducer, initialFlow, type FlowState } from './flow';
import type { FormValues } from '../types';

const VALUES: FormValues = {
  major: 'NNA',
  cohort: 'QH25',
  track: 'THUONG',
  semester: '1',
  level: '3',
  year: '2026-2027',
};

const COMPLETE = [
  'FLF1010', 'FLF1007', // II.2: 6
  'FLF1059', 'VLF1053', // III.2: 6
  'ENG3029', 'ENG3070', 'ENG2072', 'ENG3073', // IV.2.2: 12
];

function atElective(): FlowState {
  const s1 = flowReducer(initialFlow, { type: 'intakeDone', values: VALUES });
  return flowReducer(s1, { type: 'goElective', situation: 'ELECTIVE', question: '' });
}

describe('flowReducer', () => {
  it('bắt đầu ở form 1', () => {
    expect(initialFlow.screen).toBe('intake');
    expect(initialFlow.intake).toBeNull();
    expect(initialFlow.selected).toEqual([]);
  });

  it('form 1 xong thì sang form 2 và lưu thông tin', () => {
    const s = flowReducer(initialFlow, { type: 'intakeDone', values: VALUES });
    expect(s.screen).toBe('situation');
    expect(s.intake).toEqual(VALUES);
  });

  it('từ form 2 quay lại form 1', () => {
    const s1 = flowReducer(initialFlow, { type: 'intakeDone', values: VALUES });
    expect(flowReducer(s1, { type: 'back' }).screen).toBe('intake');
  });

  it('tiếp tục từ form 2 thì sang form 3.3, giữ câu hỏi đã bỏ khoảng trắng', () => {
    const s1 = flowReducer(initialFlow, { type: 'intakeDone', values: VALUES });
    const s2 = flowReducer(s1, { type: 'goElective', situation: 'ELECTIVE', question: '  Tôi có được rút môn không?  ' });
    expect(s2.screen).toBe('elective');
    expect(s2.question).toBe('Tôi có được rút môn không?');
  });

  it('không cho sang form 3.3 khi chưa có thông tin form 1', () => {
    expect(flowReducer(initialFlow, { type: 'goElective', situation: 'ELECTIVE', question: '' })).toBe(initialFlow);
  });

  it('chọn và bỏ chọn môn ở form 3.3', () => {
    const s1 = flowReducer(atElective(), { type: 'toggleCourse', code: 'FLF1010' });
    expect(s1.selected).toEqual(['FLF1010']);
    const s2 = flowReducer(s1, { type: 'toggleCourse', code: 'FLF1010' });
    expect(s2.selected).toEqual([]);
  });

  it('không chọn môn được khi không ở form 3.3', () => {
    const s1 = flowReducer(initialFlow, { type: 'intakeDone', values: VALUES });
    expect(flowReducer(s1, { type: 'toggleCourse', code: 'FLF1010' })).toBe(s1);
  });

  it('không bắt buộc đủ X tín: chưa chọn đủ vẫn sang form 3.3.1', () => {
    const s = flowReducer(atElective(), { type: 'toggleCourse', code: 'FLF1010' });
    expect(flowReducer(s, { type: 'goAnalysis' }).screen).toBe('analysis');
  });

  it('chọn đủ X tín ở mọi khối thì sang form 3.3.1', () => {
    let s = atElective();
    for (const code of COMPLETE) s = flowReducer(s, { type: 'toggleCourse', code });
    const next = flowReducer(s, { type: 'goAnalysis' });
    expect(next.screen).toBe('analysis');
    expect(next.selected).toEqual(COMPLETE);
  });

  it('quay lại từ form 3.3.1 về form 3.3 và giữ lựa chọn', () => {
    let s = atElective();
    for (const code of COMPLETE) s = flowReducer(s, { type: 'toggleCourse', code });
    s = flowReducer(s, { type: 'goAnalysis' });
    const back = flowReducer(s, { type: 'back' });
    expect(back.screen).toBe('elective');
    expect(back.selected).toEqual(COMPLETE);
  });

  it('quay lại từ form 3.3 về form 2 và xóa câu hỏi', () => {
    const s1 = flowReducer(initialFlow, { type: 'intakeDone', values: VALUES });
    const s2 = flowReducer(s1, { type: 'goElective', situation: 'ELECTIVE', question: 'abc' });
    const s3 = flowReducer(s2, { type: 'back' });
    expect(s3.screen).toBe('situation');
    expect(s3.question).toBe('');
  });
});
