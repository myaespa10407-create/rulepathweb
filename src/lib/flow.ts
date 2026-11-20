import type { FormValues } from '../types';
import { toggleCourse } from './electiveLogic';
import type { SituationId } from './situationLogic';

export type Screen = 'intake' | 'situation' | 'elective' | 'analysis';

export interface FlowState {
  screen: Screen;
  intake: FormValues | null;
  situation: SituationId | null;
  question: string;
  selected: string[];
}

export type FlowAction =
  | { type: 'intakeDone'; values: FormValues }
  | { type: 'back' }
  | { type: 'goElective'; situation: SituationId; question: string }
  | { type: 'toggleCourse'; code: string }
  | { type: 'goAnalysis' };

export const initialFlow: FlowState = {
  screen: 'intake',
  intake: null,
  situation: null,
  question: '',
  selected: [],
};

// Luồng: form 1 → form 2 (tình huống + câu hỏi) → form 3.3 (chọn môn) → form 3.1.1 (kết quả)
export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'intakeDone':
      return { ...state, screen: 'situation', intake: action.values };

    case 'back':
      if (state.screen === 'analysis') {
        return { ...state, screen: 'elective' };
      }
      if (state.screen === 'elective') {
        return { ...state, screen: 'situation', situation: null, question: '' };
      }
      if (state.screen === 'situation') {
        return { ...state, screen: 'intake' };
      }
      return state;

    // Tình huống và câu hỏi thêm (nếu có) được gửi cùng lúc khi bấm Tiếp tục
    case 'goElective':
      return state.intake
        ? {
            ...state,
            screen: 'elective',
            situation: action.situation,
            question: action.question.trim(),
          }
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
