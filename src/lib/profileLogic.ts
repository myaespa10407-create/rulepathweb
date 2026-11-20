import type { FormValues } from '../types';

// Logic hồ sơ và môn đã học/đã đăng ký (thuần, không phụ thuộc giao diện).

export type Category = 'Bắt buộc' | 'Tự chọn';
export type Muc = 'I' | 'II' | 'III' | 'IV' | 'V';
export type Track = 'V.1' | 'V.2' | 'V.3' | 'V.4' | 'V.5';
export type CourseStatus = 'registered' | 'completed';

export const MUCS: Muc[] = ['I', 'II', 'III', 'IV', 'V'];
export const TRACKS: Track[] = ['V.1', 'V.2', 'V.3', 'V.4', 'V.5'];
export const LANGUAGE_CODES = ['FR', 'ZH', 'DE', 'JA', 'KO', 'ES', 'TH', 'IT', 'LO', 'VI'] as const;

export interface CatalogCourse {
  code: string;
  name: string;
  credits: number;
  category: Category;
  section: string;      // ví dụ: "II.2 Tự chọn – chọn 6/21 TC"
  muc: Muc;
  starred: boolean;
  language_code: string | null;
}

export interface StudentRules {
  level: '3' | '4' | '5';           // bậc của ngôn ngữ thứ nhất
  secondLanguage: string;           // bắt buộc
  isInternational: boolean;
  yearOfStudy: 1 | 2 | 3 | 4;       // năm học thứ mấy
  track: Track | null;              // hướng Mục V: chỉ chọn từ năm 3
}

export interface SelectedCourse {
  code: string;
  status: CourseStatus;
  class_code: string | null;
}

const OUTSIDE_129 = 'Ngoài 129 TC';

// Bỏ dấu tiếng Việt (kể cả chữ đ) để tìm kiếm không phân biệt dấu.
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export function matchesSearch(course: Pick<CatalogCourse, 'code' | 'name'>, query: string): boolean {
  const q = normalize(query);
  if (q === '') return true;
  return normalize(course.code).includes(q) || normalize(course.name).includes(q);
}

// Môn nào được hiện cho sinh viên này (trước khi tìm kiếm).
export function isVisible(course: CatalogCourse, rules: StudentRules): boolean {
  // Tiếng Việt (B1 và B2) chỉ dành cho sinh viên nước ngoài
  if (course.language_code === 'VI' && !rules.isInternational) return false;

  const isB1 = course.section.startsWith('I. Kiến thức chung') && course.language_code !== null;
  if (isB1) return course.language_code === rules.secondLanguage;

  if (course.section.startsWith('IV.1')) {
    return course.section.includes(`bậc ${rules.level}`);
  }

  // Mục V chỉ áp dụng từ năm 3. Năm 1–2 không có môn Mục V.
  if (course.section.startsWith('V.')) {
    if (rules.yearOfStudy < 3) return false;
    if (course.section.startsWith('V.6')) return true;
    return rules.track !== null && course.section.startsWith(`${rules.track} `);
  }
  return true;
}

// Môn có tính vào tín chỉ của chương trình 129 TC không.
export function isCounted(course: CatalogCourse): boolean {
  return !course.section.includes(OUTSIDE_129);
}

// Tổng tín cần đăng ký theo từng Mục I–V cho sinh viên này.
export function requiredByMuc(catalog: CatalogCourse[], rules: StudentRules): Record<Muc, number> {
  const result: Record<Muc, number> = { I: 0, II: 0, III: 0, IV: 0, V: 0 };
  const seenSections = new Set<string>();

  for (const course of catalog) {
    if (!isCounted(course) || !isVisible(course, rules)) continue;
    if (course.category === 'Bắt buộc') {
      result[course.muc] += course.credits;
    }
  }

  for (const course of catalog) {
    if (!isCounted(course) || !isVisible(course, rules)) continue;
    const match = /chọn (\d+)\/(\d+)/.exec(course.section);
    if (!match || seenSections.has(course.section)) continue;
    seenSections.add(course.section);
    result[course.muc] += Number(match[1]);
  }

  return result;
}

export function totalRequired(catalog: CatalogCourse[], rules: StudentRules): number {
  const byMuc = requiredByMuc(catalog, rules);
  return MUCS.reduce((sum, m) => sum + byMuc[m], 0);
}

// Tín đã chọn theo từng Mục (chỉ tính môn trong chương trình 129 TC).
export function selectedByMuc(
  catalog: CatalogCourse[],
  selected: SelectedCourse[],
  status: CourseStatus,
): Record<Muc, number> {
  const result: Record<Muc, number> = { I: 0, II: 0, III: 0, IV: 0, V: 0 };
  const byCode = new Map<string, CatalogCourse>();
  for (const c of catalog) {
    if (!byCode.has(c.code) && isCounted(c)) byCode.set(c.code, c);
  }
  for (const s of selected) {
    if (s.status !== status) continue;
    const course = byCode.get(s.code);
    if (course) result[course.muc] += course.credits;
  }
  return result;
}

export interface SelectionErrors {
  duplicate: string[];                 // mã trùng
  missingClass: string[];              // đã đăng ký nhưng thiếu mã lớp
  bothStatuses: string[];              // vừa đã học vừa đã đăng ký
}

export function validateSelection(selected: SelectedCourse[]): SelectionErrors {
  const count = new Map<string, number>();
  for (const s of selected) count.set(s.code, (count.get(s.code) ?? 0) + 1);

  const duplicate = [...count].filter(([, n]) => n > 1).map(([code]) => code);
  const missingClass = selected
    .filter((s) => s.status === 'registered' && !(s.class_code ?? '').trim())
    .map((s) => s.code);
  const bothStatuses = duplicate.filter((code) => {
    const statuses = new Set(selected.filter((s) => s.code === code).map((s) => s.status));
    return statuses.size > 1;
  });

  return { duplicate, missingClass, bothStatuses };
}

export function hasSelectionErrors(e: SelectionErrors): boolean {
  return e.duplicate.length > 0 || e.missingClass.length > 0;
}

// ---------- Hồ sơ (form 1) ----------

// Dòng trong bảng profiles (tên cột theo database)
export interface ProfileRow {
  id: string;
  username: string;
  major: string;
  cohort: string;
  track: string;
  semester: string;
  level: string | null;
  school_year: string;
  year_of_study: number | null;
  is_international: boolean;
  first_language: string;
  second_language: string | null;
  muc5_track: string | null;
}

// Dữ liệu đang nằm trên form 1 (tên theo giao diện)
export interface ProfileInput {
  major: string;
  cohort: string;
  track: string;                 // THUONG | BRT
  semester: string;              // 1 | 2
  level: '3' | '4' | '5' | null;
  schoolYear: string;
  yearOfStudy: 1 | 2 | 3 | 4 | null;
  isInternational: boolean;
  secondLanguage: string | null;
  muc5Track: Track | null;
}

export type ProfileErrors = Partial<Record<keyof ProfileInput, string>>;

export const LANGUAGE_OPTIONS: { value: string; label: string }[] = [
  { value: 'FR', label: 'Tiếng Pháp' },
  { value: 'ZH', label: 'Tiếng Trung Quốc' },
  { value: 'DE', label: 'Tiếng Đức' },
  { value: 'JA', label: 'Tiếng Nhật' },
  { value: 'KO', label: 'Tiếng Hàn Quốc' },
  { value: 'ES', label: 'Tiếng Tây Ban Nha' },
  { value: 'TH', label: 'Tiếng Thái Lan' },
  { value: 'IT', label: 'Tiếng Ý' },
  { value: 'LO', label: 'Tiếng Lào' },
  { value: 'VI', label: 'Tiếng Việt (chỉ sinh viên nước ngoài)' },
];

export const TRACK_OPTIONS: Record<Track, string> = {
  'V.1': 'Biên phiên dịch',
  'V.2': 'Ngôn ngữ và Văn hóa',
  'V.3': 'Quản trị',
  'V.4': 'Kinh doanh – Thương mại',
  'V.5': 'Quốc tế học',
};

export const MSG_BRT = 'Hệ BRT hiện chưa được cập nhật trong hệ thống. Vui lòng chọn hệ Thường.';
export const MSG_SEMESTER_2 = 'Học kỳ 2 hiện chưa có thông tin. Vui lòng chọn học kỳ 1.';

// Kiểm tra form 1. Trả về rỗng khi hợp lệ.
export function validateProfileInput(input: ProfileInput): ProfileErrors {
  const errors: ProfileErrors = {};
  if (input.track !== 'THUONG') errors.track = MSG_BRT;
  if (input.semester !== '1') errors.semester = MSG_SEMESTER_2;
  if (!input.level) errors.level = 'Vui lòng chọn bậc của ngôn ngữ thứ nhất.';
  if (!input.yearOfStudy) errors.yearOfStudy = 'Vui lòng chọn năm học thứ mấy.';
  if (!input.secondLanguage) {
    errors.secondLanguage = 'Vui lòng chọn ngôn ngữ thứ hai (bắt buộc).';
  } else if (input.secondLanguage === 'VI' && !input.isInternational) {
    errors.secondLanguage = 'Tiếng Việt chỉ dành cho sinh viên nước ngoài.';
  }
  if (input.yearOfStudy !== null && input.yearOfStudy >= 3 && !input.muc5Track) {
    errors.muc5Track = 'Sinh viên năm 3 trở lên cần chọn hướng Mục V.';
  }
  return errors;
}

export function isProfileComplete(input: ProfileInput): boolean {
  return Object.keys(validateProfileInput(input)).length === 0;
}

export function inputFromRow(row: ProfileRow): ProfileInput {
  return {
    major: row.major,
    cohort: row.cohort,
    track: row.track,
    semester: row.semester,
    level: (row.level as ProfileInput['level']) ?? null,
    schoolYear: row.school_year,
    yearOfStudy: (row.year_of_study as ProfileInput['yearOfStudy']) ?? null,
    isInternational: row.is_international,
    secondLanguage: row.second_language,
    muc5Track: (row.muc5_track as Track | null) ?? null,
  };
}

// Dữ liệu ghi xuống database. Năm 1–2 luôn không có hướng (đúng ràng buộc của bảng).
export function rowPatchFromInput(input: ProfileInput) {
  const year = input.yearOfStudy;
  const track = year !== null && year >= 3 ? input.muc5Track : null;
  return {
    major: input.major,
    cohort: input.cohort,
    track: input.track,
    semester: input.semester,
    level: input.level,
    school_year: input.schoolYear,
    year_of_study: year,
    is_international: input.isInternational,
    first_language: 'EN',
    second_language: input.secondLanguage,
    muc5_track: track,
  };
}

// Quy tắc dùng để lọc môn và tính tổng tín
export function rulesFromInput(input: ProfileInput): StudentRules {
  return {
    level: input.level ?? '3',
    secondLanguage: input.secondLanguage ?? '',
    isInternational: input.isInternational,
    yearOfStudy: input.yearOfStudy ?? 1,
    track: input.muc5Track,
  };
}

// Tóm tắt cho màn form 2 (dùng lại summaryLine cũ)
export function toFormValues(input: ProfileInput): FormValues {
  return {
    major: input.major,
    cohort: input.cohort,
    track: input.track,
    semester: input.semester,
    level: input.level ?? '3',
    year: input.schoolYear,
  };
}
