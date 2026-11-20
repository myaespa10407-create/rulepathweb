import type { FormValues } from '../types';
import { toggleCourse } from './electiveLogic';

export type Screen = 'intake' | 'situation' | 'elective' | 'analysis';

export interface FlowState {
  screen: Screen;
  intake: FormValues | null;
  question: string;
  selected: string[];
}

export type FlowAction =
  | { type: 'intakeDone'; values: FormValues }
  | { type: 'back' }
  | { type: 'goElective'; question: string }
  | { type: 'toggleCourse'; code: string }
  | { type: 'goAnalysis' };

export const initialFlow: FlowState = {
  screen: 'intake',
  intake: null,
  question: '',
  selected: [],
};

// Luồng: form 1 → form 2 → form 3.3 (chọn môn) → form 3.3.1 (phân tích, làm sau)
export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'intakeDone':
      return { ...state, screen: 'situation', intake: action.values };

    case 'back':
      if (state.screen === 'analysis') {
        return { ...state, screen: 'elective' };
      }
      if (state.screen === 'elective') {
        return { ...state, screen: 'situation', question: '' };
      }
      if (state.screen === 'situation') {
        return { ...state, screen: 'intake' };
      }
      return state;

    // Câu hỏi thêm (nếu có) được gửi cùng lúc với lựa chọn đăng ký môn tự chọn
    case 'goElective':
      return state.intake
        ? { ...state, screen: 'elective', question: action.question.trim() }
        : state;

    case 'toggleCourse':
      return state.screen === 'elective'
        ? { ...state, selected: toggleCourse(state.selected, action.code) }
        : state;

    // Không bắt buộc đủ X tín; việc chặn khi vượt được xử lý ở màn hình 3.3
    case 'goAnalysis':
      return state.screen === 'elective' ? { ...state, screen: 'analysis' } : state;

    default:
      return state;
  }
}
