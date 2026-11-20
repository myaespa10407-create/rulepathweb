import type { FieldName, FormValues } from '../types';
import { FIELD_LABELS, OPTIONS } from './formLogic';

export type SituationId = 'WITHDRAW' | 'RETAKE_GPA' | 'ELECTIVE';

export const SITUATIONS: { id: SituationId; label: string }[] = [
  { id: 'WITHDRAW', label: 'Rút học phần' },
  { id: 'RETAKE_GPA', label: 'Học lại/GPA' },
  { id: 'ELECTIVE', label: 'Đăng ký môn tự chọn' },
];

export const UPDATE_LATER = 'Tính năng cập nhật sau.';

// Thông báo khi chọn tình huống chưa làm
export function situationNotice(id: SituationId | null): string | null {
  if (id === 'WITHDRAW' || id === 'RETAKE_GPA') return UPDATE_LATER;
  return null;
}

// Chỉ tình huống đăng ký môn tự chọn mới được đi tiếp
export function canContinue(id: SituationId | null): boolean {
  return id === 'ELECTIVE';
}

// Tóm tắt thông tin form 1 để hiển thị ở đầu form 2
export function summaryLine(values: FormValues): string {
  return (Object.keys(FIELD_LABELS) as FieldName[])
    .map((name) => {
      const option = OPTIONS[name].find((o) => o.value === values[name]);
      return `${FIELD_LABELS[name]}: ${option ? option.label : values[name]}`;
    })
    .join(' · ');
}

// Nhắc sinh viên chọn tình huống khi đã gõ câu hỏi nhưng chưa chọn
export function needsSituationHint(id: SituationId | null, question: string): boolean {
  return id === null && question.trim().length > 0;
}
