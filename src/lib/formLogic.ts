import type { FieldName, FormValues, Option } from '../types';

export const OPTIONS: Record<FieldName, Option[]> = {
  major: [{ value: 'NNA', label: 'Ngôn ngữ Anh' }],
  cohort: [{ value: 'QH25', label: 'QH2025 (QH25)' }],
  track: [
    { value: 'THUONG', label: 'Thường' },
    { value: 'BRT', label: 'BRT' },
  ],
  semester: [
    { value: '1', label: 'Học kỳ 1' },
    { value: '2', label: 'Học kỳ 2' },
  ],
  level: [
    { value: '3', label: 'Bậc 3' },
    { value: '4', label: 'Bậc 4' },
    { value: '5', label: 'Bậc 5' },
  ],
  year: [{ value: '2026-2027', label: '2026-2027 (26-27)' }],
};

export const FIELD_LABELS: Record<FieldName, string> = {
  major: 'Ngành',
  cohort: 'Khóa',
  track: 'Hệ',
  semester: 'Học kỳ',
  level: 'Bậc',
  year: 'Năm học',
};

// Lựa chọn hợp lệ nhưng MVP chưa hỗ trợ
const BLOCKED: Partial<Record<FieldName, Record<string, string>>> = {
  track: {
    BRT: 'Hệ BRT hiện chưa được cập nhật trong hệ thống. Vui lòng chọn hệ Thường.',
  },
  semester: {
    '2': 'Học kỳ 2 hiện chưa có thông tin. Vui lòng chọn học kỳ 1.',
  },
};

export interface CourseItem {
  code: string;
  name: string;
  credits: number;
}

// Khối IV.1 theo bậc, mỗi nhóm 18 TC (CTĐT NNA mục IV.1)
export const COURSE_GROUPS: Record<string, CourseItem[]> = {
  '3': [
    { code: 'ENG2048', name: 'Tiếng Anh Xã hội 1', credits: 3 },
    { code: 'ENG2049', name: 'Tiếng Anh Học thuật 1', credits: 3 },
    { code: 'ENG2050', name: 'Tiếng Anh Xã hội 2', credits: 3 },
    { code: 'ENG2051', name: 'Tiếng Anh Học thuật 2', credits: 3 },
    { code: 'ENG2065', name: 'Viết luận đại học', credits: 3 },
    { code: 'ENG2066', name: 'Diễn thuyết trước công chúng', credits: 3 },
  ],
  '4': [
    { code: 'ENG2050', name: 'Tiếng Anh Xã hội 2', credits: 3 },
    { code: 'ENG2051', name: 'Tiếng Anh Học thuật 2', credits: 3 },
    { code: 'ENG2068', name: 'Tiếng Anh cho các vấn đề đương đại 1', credits: 3 },
    { code: 'ENG2069', name: 'Tiếng Anh cho các vấn đề đương đại 2', credits: 3 },
    { code: 'ENG2065', name: 'Viết luận đại học', credits: 3 },
    { code: 'ENG2066', name: 'Diễn thuyết trước công chúng', credits: 3 },
  ],
  '5': [
    { code: 'ENG2068', name: 'Tiếng Anh cho các vấn đề đương đại 1', credits: 3 },
    { code: 'ENG2069', name: 'Tiếng Anh cho các vấn đề đương đại 2', credits: 3 },
    { code: 'ENG2065', name: 'Viết luận đại học', credits: 3 },
    { code: 'ENG2066', name: 'Diễn thuyết trước công chúng', credits: 3 },
    { code: 'ENG3055', name: 'Ngôn ngữ và truyền thông', credits: 3 },
    { code: 'ENG3071', name: 'Tiếng Anh giao tiếp trong kinh doanh', credits: 3 },
  ],
};

export type Errors = Partial<Record<FieldName, string>>;

export interface ValidationResult {
  errors: Errors;
  blockers: string[];
  canProceed: boolean;
}

export function checkField(name: FieldName, value: string | undefined): string | null {
  const label = FIELD_LABELS[name].toLowerCase();
  if (value === undefined || value.trim() === '') {
    return `Vui lòng chọn ${label}.`;
  }
  const allowed = OPTIONS[name].map((o) => o.value);
  if (!allowed.includes(value)) {
    return `Giá trị "${value}" không hợp lệ cho ${label}.`;
  }
  return null;
}

export function validateForm(values: Partial<FormValues>): ValidationResult {
  const errors: Errors = {};
  const blockers: string[] = [];

  for (const name of Object.keys(FIELD_LABELS) as FieldName[]) {
    const err = checkField(name, values[name]);
    if (err) errors[name] = err;
  }

  for (const name of Object.keys(BLOCKED) as FieldName[]) {
    if (errors[name]) continue;
    const msg = BLOCKED[name]?.[values[name] ?? ''];
    if (msg) blockers.push(msg);
  }

  return {
    errors,
    blockers,
    canProceed: Object.keys(errors).length === 0 && blockers.length === 0,
  };
}

export function getCourseGroup(level: string): CourseItem[] | null {
  const group = COURSE_GROUPS[level];
  return group ? group.map((c) => ({ ...c })) : null;
}

export function totalCredits(courses: CourseItem[]): number {
  return courses.reduce((sum, c) => sum + c.credits, 0);
}