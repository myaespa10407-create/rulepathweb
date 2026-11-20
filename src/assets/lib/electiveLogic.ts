// Dữ liệu và logic chọn môn tự chọn (form 3.3).
// Nguồn: CTĐT NNA mục II.2, III.2, IV.2.2 và B2; các môn đã đối chiếu với TKB HK1 2026-2027.
// Quy tắc X/Y đã xác nhận: phải chọn đúng X tín trong khối (X vừa là tối đa vừa là tối thiểu).

export type BlockId = 'II.2' | 'III.2' | 'IV.2.2';

export interface BlockInfo {
  id: BlockId;
  title: string;
  required: number; // X tín phải chọn
  total: number; // Y tín của khối (chỉ để hiển thị)
}

export interface Course {
  code: string;
  name: string;
  credits: number;
  block: BlockId | 'B2';
  prereq?: string; // học phần học trước, nếu có
}

export const BLOCKS: BlockInfo[] = [
  { id: 'II.2', title: 'Khối II.2 – Kiến thức chung theo lĩnh vực', required: 6, total: 21 },
  { id: 'III.2', title: 'Khối III.2 – Kiến thức theo khối ngành', required: 6, total: 39 },
  { id: 'IV.2.2', title: 'Khối IV.2.2 – Kiến thức chung theo nhóm ngành', required: 12, total: 33 },
];

export const COURSES: Course[] = [
  // II.2
  { code: 'FLF1010', name: 'Trí tuệ cảm xúc và giao tiếp xã hội', credits: 3, block: 'II.2' },
  { code: 'FLF1007', name: 'Công nghệ thông tin và truyền thông', credits: 3, block: 'II.2' },
  { code: 'FLF1016', name: 'Địa chính trị', credits: 3, block: 'II.2' },
  { code: 'FLF1006', name: 'Tìm hiểu cộng đồng Châu Âu', credits: 3, block: 'II.2' },
  { code: 'FLF1005', name: 'Tìm hiểu cộng đồng Châu Á', credits: 3, block: 'II.2' },
  { code: 'FLF1015', name: 'Học tập cùng cộng đồng', credits: 3, block: 'II.2' },

  // III.2
  { code: 'FLF1059', name: 'Thống kê và phân tích dữ liệu trong nghiên cứu khoa học', credits: 3, block: 'III.2' },
  { code: 'VLF1053', name: 'Tiếng Việt thực hành', credits: 3, block: 'III.2' },
  { code: 'FLF1002', name: 'Phương pháp luận nghiên cứu khoa học', credits: 3, block: 'III.2' },
  { code: 'PHI1051', name: 'Logic học đại cương', credits: 3, block: 'III.2' },
  { code: 'FLF1056', name: 'Tư duy phê phán', credits: 3, block: 'III.2' },
  { code: 'FLF1050', name: 'Cảm thụ nghệ thuật', credits: 3, block: 'III.2' },
  { code: 'PSF1050', name: 'Tâm lý học đại cương', credits: 3, block: 'III.2' },
  { code: 'HIS1053', name: 'Lịch sử văn minh thế giới', credits: 3, block: 'III.2' },
  { code: 'FLF1057', name: 'Văn hóa các nước ASEAN', credits: 3, block: 'III.2' },
  { code: 'FLF1052', name: 'Tư duy hình ảnh', credits: 3, block: 'III.2' },
  { code: 'FLF1053', name: 'Thiết kế cuộc đời', credits: 3, block: 'III.2' },
  { code: 'FLF1054', name: 'Thư pháp', credits: 3, block: 'III.2' },

  // IV.2.2 (các môn có yêu cầu học trước ENG2051)
  { code: 'ENG3029', name: 'Báo chí trực tuyến', credits: 3, block: 'IV.2.2', prereq: 'ENG2051' },
  { code: 'ENG3070', name: 'Tiếng Anh du lịch', credits: 3, block: 'IV.2.2', prereq: 'ENG2051' },
  { code: 'ENG2072', name: 'Tiếng Anh khoa học công nghệ', credits: 3, block: 'IV.2.2', prereq: 'ENG2051' },
  { code: 'ENG3073', name: 'Tiếng Anh Tài chính Ngân hàng', credits: 3, block: 'IV.2.2', prereq: 'ENG2051' },
  { code: 'ENG2071', name: 'Lịch sử giao thương Đông Á', credits: 3, block: 'IV.2.2', prereq: 'ENG2051' },

  // Ngoại ngữ B2 (tự chọn tự do: không tính vào khối, không tính GPA, không tính học phí)
  { code: 'FLF1308B', name: 'Ngoại ngữ B2 – Tiếng Pháp', credits: 5, block: 'B2' },
  { code: 'FLF1408B', name: 'Ngoại ngữ B2 – Tiếng Trung Quốc', credits: 5, block: 'B2' },
  { code: 'FLF1508B', name: 'Ngoại ngữ B2 – Tiếng Đức', credits: 5, block: 'B2' },
  { code: 'FLF1608B', name: 'Ngoại ngữ B2 – Tiếng Nhật', credits: 5, block: 'B2' },
  { code: 'FLF1708B', name: 'Ngoại ngữ B2 – Tiếng Hàn Quốc', credits: 5, block: 'B2' },
  { code: 'FLF1908B', name: 'Ngoại ngữ B2 – Tiếng Thái Lan', credits: 5, block: 'B2' },
];

export type BlockStatus = 'ok' | 'thieu' | 'vuot';

export function coursesOf(block: BlockId | 'B2'): Course[] {
  return COURSES.filter((c) => c.block === block);
}

// Tổng tín đã chọn trong một khối (B2 không tính vào khối)
export function blockCredits(selected: string[], block: BlockId): number {
  return COURSES.filter((c) => c.block === block && selected.includes(c.code)).reduce(
    (sum, c) => sum + c.credits,
    0,
  );
}

export function blockStatus(credits: number, required: number): BlockStatus {
  if (credits === required) return 'ok';
  return credits < required ? 'thieu' : 'vuot';
}

export function blockMessage(credits: number, required: number): string {
  const status = blockStatus(credits, required);
  if (status === 'ok') return `Đủ ${required}/${required} tín`;
  if (status === 'thieu') return `Còn thiếu ${required - credits} tín (đã chọn ${credits}/${required})`;
  return `Vượt ${credits - required} tín (đã chọn ${credits}/${required}), cần bỏ bớt`;
}

// Chọn xong khi mỗi khối đều đúng X tín
export function isSelectionComplete(selected: string[]): boolean {
  return BLOCKS.every((b) => blockCredits(selected, b.id) === b.required);
}

export function toggleCourse(selected: string[], code: string): string[] {
  return selected.includes(code) ? selected.filter((c) => c !== code) : [...selected, code];
}
