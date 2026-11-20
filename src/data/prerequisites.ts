// Học phần trước (HP học trước) theo CTĐT ngành Ngôn ngữ Anh QH25 (mã NNA_7220201).
// Nguồn: khung chương trình đào tạo, cột "HP học trước".
// Chỉ ghi các môn có học trước trong CTĐT. Môn không có trong bảng này = không yêu cầu học trước.
// section: nếu học trước chỉ áp dụng cho một hướng Mục V thì ghi tiền tố mục (ví dụ "V.3.2").

export interface PrereqRule {
  prereq: string[];
  section?: string;
}

export const PREREQUISITES: Record<string, PrereqRule> = {
  // Khối II.2, III.2 (tự chọn)
  ENG1001B: { prereq: ['ENG2049'] },

  // Khối IV.2.1 (bắt buộc)
  ENG2055: { prereq: ['ENG2051'] },
  ENG2056: { prereq: ['ENG2055'] },
  ENG2052: { prereq: ['ENG2051'] },
  ENG2054: { prereq: ['ENG2051'] },

  // Khối IV.2.2 (tự chọn)
  ENG3029: { prereq: ['ENG2051'] },
  ENG3015: { prereq: ['ENG2051'] },
  ENG2053: { prereq: ['ENG2051'] },
  ENG2044: { prereq: ['ENG2051'] },
  ENG2071: { prereq: ['ENG2051'] },
  ENG3073: { prereq: ['ENG2051'] },
  ENG3070: { prereq: ['ENG2051'] },
  ENG2072: { prereq: ['ENG2051'] },
  ENG2057: { prereq: ['ENG2055'] },
  ENG2073: { prereq: ['ENG2055'] },
  ENG2075: { prereq: ['ENG2051'] },

  // Mục V (chỉ dùng khi có đăng ký Mục V)
  ENG3127: { prereq: ['ENG3040'], section: 'V.3.2' },
  ENG3030: { prereq: ['ENG2051'] },
  ENG3062: { prereq: ['ENG2051'] },
  ENG3049: { prereq: ['ENG2051'] },
  ENG3032: { prereq: ['ENG3049', 'ENG3062'] },
  ENG3006: { prereq: ['ENG3030'] },
  ENG3064: { prereq: ['ENG3062'] },
  ENG3031: { prereq: ['ENG3030'] },
  ENG3063: { prereq: ['ENG3062'] },
  ENG3081: { prereq: ['ENG3030', 'ENG3062'] },
};

// Học trước của một dòng môn (có xét hướng Mục V nếu có)
export function prereqsOf(code: string, section: string): string[] {
  const rule = PREREQUISITES[code];
  if (!rule) return [];
  if (rule.section && !section.startsWith(rule.section)) return [];
  return rule.prereq;
}
