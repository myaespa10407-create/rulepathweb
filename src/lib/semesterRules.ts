// Quy tắc số tín chỉ trong một học kỳ (nguồn: Phòng Đào tạo và Người học).
// Tổng = tín các môn đã đăng ký trong học kỳ này + tín các môn đang chọn ở tình huống.
// Không tính: môn đã học ở học kỳ trước, và học phần B2 (tự chọn tự do).
// Chỉ cảnh báo, không khóa nút Tiếp tục.
// Thuần, không phụ thuộc giao diện.
import type { CatalogCourse, SelectedCourse } from './profileLogic';

export const SEMESTER_MIN = 14;
export const SEMESTER_MAX = 55;
export const SEMESTER_SOURCE = 'Phòng Đào tạo và Người học – quy định 14–55 TC mỗi học kỳ';

export type SemesterStatus = 'thieu' | 'ok' | 'vuot';

export interface SemesterView {
  registered: number;   // tín đã đăng ký trong học kỳ này
  picked: number;       // tín đang chọn trên form 3.3 (không trùng với đã đăng ký)
  total: number;        // registered + picked
  status: SemesterStatus;
  missing: number;      // còn thiếu bao nhiêu TC để đạt mức tối thiểu (0 nếu đủ)
  over: number;         // vượt bao nhiêu TC so với mức tối đa (0 nếu không vượt)
}

export function semesterStatus(total: number): SemesterStatus {
  if (total > SEMESTER_MAX) return 'vuot';
  if (total < SEMESTER_MIN) return 'thieu';
  return 'ok';
}

// Số tín của một mã môn tính vào tổng học kỳ.
// Trả về 0 cho học phần B2 và môn ngoài 129 TC (không tính vào tổng học kỳ).
export function creditOf(catalog: CatalogCourse[], code: string): number {
  const row = catalog.find((c) => c.code === code && !c.section.includes('Ngoài 129 TC'));
  return row ? row.credits : 0;
}

export function semesterView(args: {
  catalog: CatalogCourse[];
  courses: SelectedCourse[];
  selected: string[];
}): SemesterView {
  const { catalog, courses, selected } = args;

  const registeredCodes = new Set(
    courses.filter((s) => s.status === 'registered').map((s) => s.code),
  );
  const registered = [...registeredCodes].reduce((sum, code) => sum + creditOf(catalog, code), 0);

  const pickedCodes = new Set(selected.filter((code) => !registeredCodes.has(code)));
  const picked = [...pickedCodes].reduce((sum, code) => sum + creditOf(catalog, code), 0);

  const total = registered + picked;
  const status = semesterStatus(total);
  return {
    registered,
    picked,
    total,
    status,
    missing: Math.max(0, SEMESTER_MIN - total),
    over: Math.max(0, total - SEMESTER_MAX),
  };
}
