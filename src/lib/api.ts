// Mọi lệnh gọi Supabase nằm ở đây. Giao diện chỉ gọi các hàm này.
import { supabase } from './supabase';
import {
  rowPatchFromInput,
  type CatalogCourse,
  type ProfileInput,
  type ProfileRow,
  type SelectedCourse,
} from './profileLogic';

export interface AppData {
  profile: ProfileRow;
  catalog: CatalogCourse[];
  courses: SelectedCourse[];
  openCodes: string[];      // môn có lớp mở trong TKB chung HK1 2026-2027 (hiện là dữ liệu mô phỏng)
}

// Học kỳ đang xử lý. Phải khớp với dữ liệu trong bảng course_classes.
export const CURRENT_SEMESTER = '1';
export const CURRENT_SCHOOL_YEAR = '2026-2027';

interface CourseRecord {
  course_code: string;
  status: 'registered' | 'completed';
  class_code: string | null;
}

// Tải toàn bộ dữ liệu cần cho app sau khi đăng nhập
export async function loadAppData(userId: string): Promise<AppData> {
  const [profileRes, catalogRes, coursesRes, classesRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase
      .from('courses')
      .select('code,name,credits,category,section,muc,starred,language_code')
      .order('section')
      .order('code'),
    supabase.from('student_courses').select('course_code,status,class_code'),
    supabase
      .from('course_classes')
      .select('course_code')
      .eq('semester', CURRENT_SEMESTER)
      .eq('school_year', CURRENT_SCHOOL_YEAR),
  ]);

  if (profileRes.error) throw profileRes.error;
  if (catalogRes.error) throw catalogRes.error;
  if (coursesRes.error) throw coursesRes.error;
  if (classesRes.error) throw classesRes.error;

  const records = (coursesRes.data ?? []) as CourseRecord[];
  const openCodes = [...new Set((classesRes.data ?? []).map((r) => r.course_code as string))];

  return {
    profile: profileRes.data as ProfileRow,
    catalog: (catalogRes.data ?? []) as unknown as CatalogCourse[],
    courses: records.map((r) => ({
      code: r.course_code,
      status: r.status,
      class_code: r.class_code,
    })),
    openCodes,
  };
}

// Lưu form 1 và danh sách môn trong một lần bấm Lưu
export async function saveAll(
  userId: string,
  input: ProfileInput,
  courses: SelectedCourse[],
): Promise<void> {
  const { error: profileError } = await supabase
    .from('profiles')
    .update(rowPatchFromInput(input))
    .eq('id', userId);
  if (profileError) throw profileError;

  const { error: coursesError } = await supabase.rpc('save_student_courses', {
    p_items: courses.map((c) => ({ code: c.code, status: c.status, class_code: c.class_code })),
  });
  if (coursesError) throw coursesError;
}
