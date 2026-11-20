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
}

interface CourseRecord {
  course_code: string;
  status: 'registered' | 'completed';
  class_code: string | null;
}

// Tải toàn bộ dữ liệu cần cho app sau khi đăng nhập
export async function loadAppData(userId: string): Promise<AppData> {
  const [profileRes, catalogRes, coursesRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase
      .from('courses')
      .select('code,name,credits,category,section,muc,starred,language_code')
      .order('section')
      .order('code'),
    supabase.from('student_courses').select('course_code,status,class_code'),
  ]);

  if (profileRes.error) throw profileRes.error;
  if (catalogRes.error) throw catalogRes.error;
  if (coursesRes.error) throw coursesRes.error;

  const records = (coursesRes.data ?? []) as CourseRecord[];

  return {
    profile: profileRes.data as ProfileRow,
    catalog: (catalogRes.data ?? []) as unknown as CatalogCourse[],
    courses: records.map((r) => ({
      code: r.course_code,
      status: r.status,
      class_code: r.class_code,
    })),
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
