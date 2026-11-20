// Dữ liệu từ courses.csv (192 môn). Sẽ thay bằng Supabase ở bước sau.
import type { CatalogCourse } from '../lib/profileLogic';

export const COURSE_CATALOG: CatalogCourse[] = [
  {
    "code": "PHI1006",
    "name": "Triết học Mác – Lênin",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": null
  },
  {
    "code": "PEC1008",
    "name": "Kinh tế chính trị Mác – Lênin",
    "credits": 2,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": null
  },
  {
    "code": "PHI1002",
    "name": "Chủ nghĩa xã hội khoa học",
    "credits": 2,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": null
  },
  {
    "code": "POL1001",
    "name": "Tư tưởng Hồ Chí Minh",
    "credits": 2,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": null
  },
  {
    "code": "HIS1001",
    "name": "Lịch sử Đảng Cộng sản Việt Nam",
    "credits": 2,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": null
  },
  {
    "code": "THL1057",
    "name": "Nhà nước và Pháp luật đại cương",
    "credits": 2,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": null
  },
  {
    "code": "INT1004",
    "name": "Tin học cơ sở 2",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": null
  },
  {
    "code": "FLF1307B",
    "name": "Tiếng Pháp B1",
    "credits": 5,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": "FR"
  },
  {
    "code": "FLF1407B",
    "name": "Tiếng Trung Quốc B1",
    "credits": 5,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": "ZH"
  },
  {
    "code": "FLF1507B",
    "name": "Tiếng Đức B1",
    "credits": 5,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": "DE"
  },
  {
    "code": "FLF1607B",
    "name": "Tiếng Nhật B1",
    "credits": 5,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": "JA"
  },
  {
    "code": "FLF1707B",
    "name": "Tiếng Hàn Quốc B1",
    "credits": 5,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": "KO"
  },
  {
    "code": "FLF1807B",
    "name": "Tiếng Tây Ban Nha B1",
    "credits": 5,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": "ES"
  },
  {
    "code": "FLF1907B",
    "name": "Tiếng Thái Lan B1",
    "credits": 5,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": "TH"
  },
  {
    "code": "FLF2107B",
    "name": "Tiếng Ý B1",
    "credits": 5,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": "IT"
  },
  {
    "code": "FLF2207B",
    "name": "Tiếng Lào B1",
    "credits": 5,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": "LO"
  },
  {
    "code": "FLF2307",
    "name": "Tiếng Việt B1",
    "credits": 5,
    "category": "Bắt buộc",
    "section": "I. Kiến thức chung",
    "muc": "I",
    "starred": false,
    "language_code": "VI"
  },
  {
    "code": "FLF1308B",
    "name": "Tiếng Pháp B2",
    "credits": 5,
    "category": "Tự chọn",
    "section": "I. Ngoài 129 TC",
    "muc": "I",
    "starred": false,
    "language_code": "FR"
  },
  {
    "code": "FLF1408B",
    "name": "Tiếng Trung Quốc B2",
    "credits": 5,
    "category": "Tự chọn",
    "section": "I. Ngoài 129 TC",
    "muc": "I",
    "starred": false,
    "language_code": "ZH"
  },
  {
    "code": "FLF1508B",
    "name": "Tiếng Đức B2",
    "credits": 5,
    "category": "Tự chọn",
    "section": "I. Ngoài 129 TC",
    "muc": "I",
    "starred": false,
    "language_code": "DE"
  },
  {
    "code": "FLF1608B",
    "name": "Tiếng Nhật B2",
    "credits": 5,
    "category": "Tự chọn",
    "section": "I. Ngoài 129 TC",
    "muc": "I",
    "starred": false,
    "language_code": "JA"
  },
  {
    "code": "FLF1708B",
    "name": "Tiếng Hàn Quốc B2",
    "credits": 5,
    "category": "Tự chọn",
    "section": "I. Ngoài 129 TC",
    "muc": "I",
    "starred": false,
    "language_code": "KO"
  },
  {
    "code": "FLF1808B",
    "name": "Tiếng Tây Ban Nha B2",
    "credits": 5,
    "category": "Tự chọn",
    "section": "I. Ngoài 129 TC",
    "muc": "I",
    "starred": false,
    "language_code": "ES"
  },
  {
    "code": "FLF1908B",
    "name": "Tiếng Thái Lan B2",
    "credits": 5,
    "category": "Tự chọn",
    "section": "I. Ngoài 129 TC",
    "muc": "I",
    "starred": false,
    "language_code": "TH"
  },
  {
    "code": "FLF2108B",
    "name": "Tiếng Ý B2",
    "credits": 5,
    "category": "Tự chọn",
    "section": "I. Ngoài 129 TC",
    "muc": "I",
    "starred": false,
    "language_code": "IT"
  },
  {
    "code": "FLF2208B",
    "name": "Tiếng Lào B2",
    "credits": 5,
    "category": "Tự chọn",
    "section": "I. Ngoài 129 TC",
    "muc": "I",
    "starred": false,
    "language_code": "LO"
  },
  {
    "code": "FLF2308",
    "name": "Tiếng Việt B2",
    "credits": 5,
    "category": "Tự chọn",
    "section": "I. Ngoài 129 TC",
    "muc": "I",
    "starred": false,
    "language_code": "VI"
  },
  {
    "code": "FLF1018",
    "name": "Kỹ năng bổ trợ",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "I. Ngoài 129 TC",
    "muc": "I",
    "starred": false,
    "language_code": null
  },
  {
    "code": "FLF1009",
    "name": "Tư duy sáng tạo khởi nghiệp",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "II.1 Bắt buộc",
    "muc": "II",
    "starred": false,
    "language_code": null
  },
  {
    "code": "FLF1010",
    "name": "Trí tuệ cảm xúc và giao tiếp xã hội",
    "credits": 3,
    "category": "Tự chọn",
    "section": "II.2 Tự chọn – chọn 6/21 TC",
    "muc": "II",
    "starred": false,
    "language_code": null
  },
  {
    "code": "FLF1007",
    "name": "Công nghệ thông tin và truyền thông",
    "credits": 3,
    "category": "Tự chọn",
    "section": "II.2 Tự chọn – chọn 6/21 TC",
    "muc": "II",
    "starred": false,
    "language_code": null
  },
  {
    "code": "FLF1016",
    "name": "Địa chính trị",
    "credits": 3,
    "category": "Tự chọn",
    "section": "II.2 Tự chọn – chọn 6/21 TC",
    "muc": "II",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG1001B",
    "name": "Địa lý đại cương",
    "credits": 3,
    "category": "Tự chọn",
    "section": "II.2 Tự chọn – chọn 6/21 TC",
    "muc": "II",
    "starred": false,
    "language_code": null
  },
  {
    "code": "FLF1006",
    "name": "Tìm hiểu cộng đồng Châu Âu",
    "credits": 3,
    "category": "Tự chọn",
    "section": "II.2 Tự chọn – chọn 6/21 TC",
    "muc": "II",
    "starred": false,
    "language_code": null
  },
  {
    "code": "FLF1005",
    "name": "Tìm hiểu cộng đồng Châu Á",
    "credits": 3,
    "category": "Tự chọn",
    "section": "II.2 Tự chọn – chọn 6/21 TC",
    "muc": "II",
    "starred": false,
    "language_code": null
  },
  {
    "code": "FLF1015",
    "name": "Học tập cùng cộng đồng",
    "credits": 3,
    "category": "Tự chọn",
    "section": "II.2 Tự chọn – chọn 6/21 TC",
    "muc": "II",
    "starred": false,
    "language_code": null
  },
  {
    "code": "HIS1056",
    "name": "Cơ sở văn hoá Việt Nam",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "III.1 Bắt buộc",
    "muc": "III",
    "starred": false,
    "language_code": null
  },
  {
    "code": "VLF1052",
    "name": "Nhập môn Việt ngữ học",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "III.1 Bắt buộc",
    "muc": "III",
    "starred": false,
    "language_code": null
  },
  {
    "code": "FLF1059",
    "name": "Thống kê và phân tích dữ liệu trong nghiên cứu khoa học",
    "credits": 3,
    "category": "Tự chọn",
    "section": "III.2 Tự chọn – chọn 6/39 TC",
    "muc": "III",
    "starred": false,
    "language_code": null
  },
  {
    "code": "VLF1053",
    "name": "Tiếng Việt thực hành",
    "credits": 3,
    "category": "Tự chọn",
    "section": "III.2 Tự chọn – chọn 6/39 TC",
    "muc": "III",
    "starred": true,
    "language_code": null
  },
  {
    "code": "FLF1002",
    "name": "Phương pháp luận nghiên cứu khoa học",
    "credits": 3,
    "category": "Tự chọn",
    "section": "III.2 Tự chọn – chọn 6/39 TC",
    "muc": "III",
    "starred": true,
    "language_code": null
  },
  {
    "code": "PHI1051",
    "name": "Logic học đại cương",
    "credits": 3,
    "category": "Tự chọn",
    "section": "III.2 Tự chọn – chọn 6/39 TC",
    "muc": "III",
    "starred": true,
    "language_code": null
  },
  {
    "code": "FLF1056",
    "name": "Tư duy phê phán",
    "credits": 3,
    "category": "Tự chọn",
    "section": "III.2 Tự chọn – chọn 6/39 TC",
    "muc": "III",
    "starred": false,
    "language_code": null
  },
  {
    "code": "FLF1050",
    "name": "Cảm thụ nghệ thuật",
    "credits": 3,
    "category": "Tự chọn",
    "section": "III.2 Tự chọn – chọn 6/39 TC",
    "muc": "III",
    "starred": false,
    "language_code": null
  },
  {
    "code": "PSF1050",
    "name": "Tâm lý học đại cương",
    "credits": 3,
    "category": "Tự chọn",
    "section": "III.2 Tự chọn – chọn 6/39 TC",
    "muc": "III",
    "starred": false,
    "language_code": null
  },
  {
    "code": "HIS1053",
    "name": "Lịch sử văn minh thế giới",
    "credits": 3,
    "category": "Tự chọn",
    "section": "III.2 Tự chọn – chọn 6/39 TC",
    "muc": "III",
    "starred": true,
    "language_code": null
  },
  {
    "code": "FLF1057",
    "name": "Văn hóa các nước ASEAN",
    "credits": 3,
    "category": "Tự chọn",
    "section": "III.2 Tự chọn – chọn 6/39 TC",
    "muc": "III",
    "starred": false,
    "language_code": null
  },
  {
    "code": "FLF1052",
    "name": "Tư duy hình ảnh",
    "credits": 3,
    "category": "Tự chọn",
    "section": "III.2 Tự chọn – chọn 6/39 TC",
    "muc": "III",
    "starred": false,
    "language_code": null
  },
  {
    "code": "FLF1053",
    "name": "Thiết kế cuộc đời",
    "credits": 3,
    "category": "Tự chọn",
    "section": "III.2 Tự chọn – chọn 6/39 TC",
    "muc": "III",
    "starred": false,
    "language_code": null
  },
  {
    "code": "FLF1054",
    "name": "Thư pháp",
    "credits": 3,
    "category": "Tự chọn",
    "section": "III.2 Tự chọn – chọn 6/39 TC",
    "muc": "III",
    "starred": false,
    "language_code": null
  },
  {
    "code": "FLF1055",
    "name": "Cổ học tinh hoa",
    "credits": 3,
    "category": "Tự chọn",
    "section": "III.2 Tự chọn – chọn 6/39 TC",
    "muc": "III",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2048",
    "name": "Tiếng Anh Xã hội 1",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 3 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2049",
    "name": "Tiếng Anh Học thuật 1",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 3 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2050",
    "name": "Tiếng Anh Xã hội 2",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 3 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2051",
    "name": "Tiếng Anh Học thuật 2",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 3 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2065",
    "name": "Viết luận đại học",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 3 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2066",
    "name": "Diễn thuyết trước công chúng",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 3 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2050",
    "name": "Tiếng Anh Xã hội 2",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 4 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2051",
    "name": "Tiếng Anh Học thuật 2",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 4 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2068",
    "name": "Tiếng Anh cho các vấn đề đương đại 1",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 4 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2069",
    "name": "Tiếng Anh cho các vấn đề đương đại 2",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 4 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2065",
    "name": "Viết luận đại học",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 4 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2066",
    "name": "Diễn thuyết trước công chúng",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 4 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2068",
    "name": "Tiếng Anh cho các vấn đề đương đại 1",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 5 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2069",
    "name": "Tiếng Anh cho các vấn đề đương đại 2",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 5 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2065",
    "name": "Viết luận đại học",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 5 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2066",
    "name": "Diễn thuyết trước công chúng",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 5 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3055",
    "name": "Ngôn ngữ và truyền thông",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 5 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3071",
    "name": "Tiếng Anh giao tiếp trong kinh doanh",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.1 Tiếng Anh bậc 5 (chọn 1 nhóm)",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2055",
    "name": "Ngôn ngữ học tiếng Anh 1",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.2.1 Bắt buộc",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2056",
    "name": "Ngôn ngữ học tiếng Anh 2",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.2.1 Bắt buộc",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2052",
    "name": "Đất nước học Anh-Mỹ",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.2.1 Bắt buộc",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2054",
    "name": "Giao tiếp liên văn hóa",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "IV.2.1 Bắt buộc",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3029",
    "name": "Báo chí trực tuyến",
    "credits": 3,
    "category": "Tự chọn",
    "section": "IV.2.2 Tự chọn – chọn 12/33 TC",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3015",
    "name": "Chủ đề quốc tế học",
    "credits": 3,
    "category": "Tự chọn",
    "section": "IV.2.2 Tự chọn – chọn 12/33 TC",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2053",
    "name": "Văn học các nước nói tiếng Anh",
    "credits": 3,
    "category": "Tự chọn",
    "section": "IV.2.2 Tự chọn – chọn 12/33 TC",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2044",
    "name": "Văn minh phương Tây",
    "credits": 3,
    "category": "Tự chọn",
    "section": "IV.2.2 Tự chọn – chọn 12/33 TC",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2071",
    "name": "Lịch sử giao thương Đông Á",
    "credits": 3,
    "category": "Tự chọn",
    "section": "IV.2.2 Tự chọn – chọn 12/33 TC",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3073",
    "name": "Tiếng Anh Tài chính Ngân hàng",
    "credits": 3,
    "category": "Tự chọn",
    "section": "IV.2.2 Tự chọn – chọn 12/33 TC",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3070",
    "name": "Tiếng Anh du lịch",
    "credits": 3,
    "category": "Tự chọn",
    "section": "IV.2.2 Tự chọn – chọn 12/33 TC",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2072",
    "name": "Tiếng Anh khoa học công nghệ",
    "credits": 3,
    "category": "Tự chọn",
    "section": "IV.2.2 Tự chọn – chọn 12/33 TC",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2057",
    "name": "Ngữ dụng học Tiếng Anh",
    "credits": 3,
    "category": "Tự chọn",
    "section": "IV.2.2 Tự chọn – chọn 12/33 TC",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2073",
    "name": "Biên tập văn bản",
    "credits": 3,
    "category": "Tự chọn",
    "section": "IV.2.2 Tự chọn – chọn 12/33 TC",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2075",
    "name": "Các tổ chức quốc tế",
    "credits": 3,
    "category": "Tự chọn",
    "section": "IV.2.2 Tự chọn – chọn 12/33 TC",
    "muc": "IV",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3049",
    "name": "Lý thuyết dịch",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.1 Biên phiên dịch",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3062",
    "name": "Phiên dịch",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.1 Biên phiên dịch",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3030",
    "name": "Biên dịch",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.1 Biên phiên dịch",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3032",
    "name": "Nghiệp vụ biên-phiên dịch",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.1 Biên phiên dịch",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3006",
    "name": "Biên dịch nâng cao",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.1 Biên phiên dịch",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3098",
    "name": "Phát triển nghề nghiệp",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.1 Biên phiên dịch",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3064",
    "name": "Phiên dịch nâng cao",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.1 Biên phiên dịch",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3031",
    "name": "Biên dịch chuyên ngành",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.1 Biên phiên dịch – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3063",
    "name": "Phiên dịch chuyên ngành",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.1 Biên phiên dịch – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3081",
    "name": "Dịch hội thảo: lý thuyết và thực hành",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.1 Biên phiên dịch – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3127",
    "name": "Đào tạo và Bồi dưỡng trong tổ chức và doanh nghiệp",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.1 Biên phiên dịch – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3057",
    "name": "Ngữ nghĩa học",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.1 Biên phiên dịch – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2060",
    "name": "Phân tích diễn ngôn",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.1 Biên phiên dịch – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2059",
    "name": "Ngữ pháp chức năng",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.1 Biên phiên dịch – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3056",
    "name": "Ngôn ngữ, Xã hội và Văn hóa",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.1 Biên phiên dịch – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3110",
    "name": "Toàn cầu hóa và sự hình thành các xã hội đương đại",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.1 Biên phiên dịch – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2045",
    "name": "Văn hóa và chính trị trong kinh doanh",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.1 Biên phiên dịch – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3079",
    "name": "Quản lý dự án",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.1 Biên phiên dịch – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3099",
    "name": "Kỹ năng lãnh đạo",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.1 Biên phiên dịch – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3125",
    "name": "Kỹ năng giao tiếp trong thời đại số",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.1 Biên phiên dịch – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3100",
    "name": "Phát triển bền vững",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.1 Biên phiên dịch – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3056",
    "name": "Ngôn ngữ, Xã hội và Văn hóa",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.2 Ngôn ngữ và Văn hóa",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2060",
    "name": "Phân tích diễn ngôn",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.2 Ngôn ngữ và Văn hóa",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3066",
    "name": "Phương pháp nghiên cứu ngôn ngữ học ứng dụng",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.2 Ngôn ngữ và Văn hóa",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3112",
    "name": "Truyền thông thị giác",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.2 Ngôn ngữ và Văn hóa",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3057",
    "name": "Ngữ nghĩa học",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.2 Ngôn ngữ và Văn hóa",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3098",
    "name": "Phát triển nghề nghiệp",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.2 Ngôn ngữ và Văn hóa",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3027",
    "name": "Âm vị học",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.2 Ngôn ngữ và Văn hóa – chọn 18/48 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3039",
    "name": "Cú pháp học",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.2 Ngôn ngữ và Văn hóa – chọn 18/48 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2059",
    "name": "Ngữ pháp chức năng",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.2 Ngôn ngữ và Văn hóa – chọn 18/48 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3101",
    "name": "Phong cách học Tiếng Anh",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.2 Ngôn ngữ và Văn hóa – chọn 18/48 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3122",
    "name": "Ngôn ngữ học truyền thông",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.2 Ngôn ngữ và Văn hóa – chọn 18/48 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3074",
    "name": "Tiếng Anh toàn cầu",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.2 Ngôn ngữ và Văn hóa – chọn 18/48 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3113",
    "name": "Di cư và các cộng đồng hải ngoại",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.2 Ngôn ngữ và Văn hóa – chọn 18/48 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3123",
    "name": "Lịch sử & chính trị của các bản sắc xã hội",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.2 Ngôn ngữ và Văn hóa – chọn 18/48 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3110",
    "name": "Toàn cầu hóa và sự hình thành các xã hội đương đại",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.2 Ngôn ngữ và Văn hóa – chọn 18/48 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3104",
    "name": "Chính sách và thể chế quốc tế",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.2 Ngôn ngữ và Văn hóa – chọn 18/48 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3079",
    "name": "Quản lý dự án",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.2 Ngôn ngữ và Văn hóa – chọn 18/48 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3105",
    "name": "Giáo dục Quốc tế và so sánh",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.2 Ngôn ngữ và Văn hóa – chọn 18/48 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3062",
    "name": "Phiên dịch",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.2 Ngôn ngữ và Văn hóa – chọn 18/48 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3030",
    "name": "Biên dịch",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.2 Ngôn ngữ và Văn hóa – chọn 18/48 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3100",
    "name": "Phát triển bền vững",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.2 Ngôn ngữ và Văn hóa – chọn 18/48 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3127",
    "name": "Đào tạo và Bồi dưỡng trong tổ chức và doanh nghiệp",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.2 Ngôn ngữ và Văn hóa – chọn 18/48 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3106",
    "name": "Kinh tế vi mô",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.3 Quản trị",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3107",
    "name": "Kinh tế vĩ mô",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.3 Quản trị",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3124",
    "name": "Nguyên tắc quản trị",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.3 Quản trị",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "BSA2006",
    "name": "Quản trị nguồn nhân lực",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.3 Quản trị",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3060",
    "name": "Quan hệ con người trong quản lý",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.3 Quản trị",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3098",
    "name": "Phát triển nghề nghiệp",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.3 Quản trị",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3079",
    "name": "Quản lý dự án",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.3 Quản trị",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "BSA2002",
    "name": "Nguyên lý marketing",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.3 Quản trị – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3118",
    "name": "Kinh doanh quốc tế",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.3 Quản trị – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2045",
    "name": "Văn hóa và chính trị trong kinh doanh",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.3 Quản trị – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3097",
    "name": "Kế hoạch tài chính cá nhân",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.3 Quản trị – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3100",
    "name": "Phát triển bền vững",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.3 Quản trị – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3099",
    "name": "Kỹ năng lãnh đạo",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.3 Quản trị – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3111",
    "name": "Đạo đức kinh doanh",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.3 Quản trị – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3125",
    "name": "Kỹ năng giao tiếp trong thời đại số",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.3 Quản trị – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3110",
    "name": "Toàn cầu hóa và sự hình thành các xã hội đương đại",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.3 Quản trị – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3112",
    "name": "Truyền thông thị giác",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.3 Quản trị – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2060",
    "name": "Phân tích diễn ngôn",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.3 Quản trị – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3127",
    "name": "Đào tạo và Bồi dưỡng trong tổ chức và doanh nghiệp",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.3 Quản trị – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3062",
    "name": "Phiên dịch",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.3 Quản trị – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3030",
    "name": "Biên dịch",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.3 Quản trị – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3106",
    "name": "Kinh tế vi mô",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.4 Kinh doanh – Thương mại",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3107",
    "name": "Kinh tế vĩ mô",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.4 Kinh doanh – Thương mại",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3060",
    "name": "Quan hệ con người trong quản lý",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.4 Kinh doanh – Thương mại",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3118",
    "name": "Kinh doanh quốc tế",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.4 Kinh doanh – Thương mại",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "BSA2002",
    "name": "Nguyên lý marketing",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.4 Kinh doanh – Thương mại",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3098",
    "name": "Phát triển nghề nghiệp",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.4 Kinh doanh – Thương mại",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2045",
    "name": "Văn hóa và chính trị trong kinh doanh",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.4 Kinh doanh – Thương mại",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "BSA2006",
    "name": "Quản trị nguồn nhân lực",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.4 Kinh doanh – Thương mại – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3018",
    "name": "Tiếp thị kỹ thuật số",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.4 Kinh doanh – Thương mại – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3079",
    "name": "Quản lý dự án",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.4 Kinh doanh – Thương mại – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3097",
    "name": "Kế hoạch tài chính cá nhân",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.4 Kinh doanh – Thương mại – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3100",
    "name": "Phát triển bền vững",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.4 Kinh doanh – Thương mại – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3099",
    "name": "Kỹ năng lãnh đạo",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.4 Kinh doanh – Thương mại – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3111",
    "name": "Đạo đức kinh doanh",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.4 Kinh doanh – Thương mại – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3112",
    "name": "Truyền thông thị giác",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.4 Kinh doanh – Thương mại – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3125",
    "name": "Kỹ năng giao tiếp trong thời đại số",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.4 Kinh doanh – Thương mại – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3110",
    "name": "Toàn cầu hóa và sự hình thành các xã hội đương đại",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.4 Kinh doanh – Thương mại – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3113",
    "name": "Di cư và các cộng đồng hải ngoại",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.4 Kinh doanh – Thương mại – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3127",
    "name": "Đào tạo và Bồi dưỡng trong tổ chức và doanh nghiệp",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.4 Kinh doanh – Thương mại – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3062",
    "name": "Phiên dịch",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.4 Kinh doanh – Thương mại – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3030",
    "name": "Biên dịch",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.4 Kinh doanh – Thương mại – chọn 15/42 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3110",
    "name": "Toàn cầu hóa và sự hình thành các xã hội đương đại",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.5 Quốc tế học",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3126",
    "name": "Đường hướng nghiên cứu quốc tế học",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.5 Quốc tế học",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3113",
    "name": "Di cư và các cộng đồng hải ngoại",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.5 Quốc tế học",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3114",
    "name": "Truyền thông và các văn hóa số",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.5 Quốc tế học",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3123",
    "name": "Lịch sử & chính trị của các bản sắc xã hội",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.5 Quốc tế học",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3098",
    "name": "Phát triển nghề nghiệp",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.5 Quốc tế học",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3104",
    "name": "Chính sách và thể chế quốc tế",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.5 Quốc tế học – chọn 18/45 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3034B",
    "name": "Các chủ đề trong nghiên cứu Đông Nam Á",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.5 Quốc tế học – chọn 18/45 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3112",
    "name": "Truyền thông thị giác",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.5 Quốc tế học – chọn 18/45 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3105",
    "name": "Giáo dục Quốc tế và so sánh",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.5 Quốc tế học – chọn 18/45 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3056",
    "name": "Ngôn ngữ, Xã hội và Văn hóa",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.5 Quốc tế học – chọn 18/45 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2059",
    "name": "Ngữ pháp chức năng",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.5 Quốc tế học – chọn 18/45 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3101",
    "name": "Phong cách học Tiếng Anh",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.5 Quốc tế học – chọn 18/45 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG2060",
    "name": "Phân tích diễn ngôn",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.5 Quốc tế học – chọn 18/45 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3057",
    "name": "Ngữ nghĩa học",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.5 Quốc tế học – chọn 18/45 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3122",
    "name": "Ngôn ngữ học truyền thông",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.5 Quốc tế học – chọn 18/45 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3074",
    "name": "Tiếng Anh toàn cầu",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.5 Quốc tế học – chọn 18/45 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3125",
    "name": "Kỹ năng giao tiếp trong thời đại số",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.5 Quốc tế học – chọn 18/45 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3062",
    "name": "Phiên dịch",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.5 Quốc tế học – chọn 18/45 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3079",
    "name": "Quản lý dự án",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.5 Quốc tế học – chọn 18/45 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG3127",
    "name": "Đào tạo và Bồi dưỡng trong tổ chức và doanh nghiệp",
    "credits": 3,
    "category": "Tự chọn",
    "section": "V.5 Quốc tế học – chọn 18/45 TC",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG4001",
    "name": "Thực tập",
    "credits": 3,
    "category": "Bắt buộc",
    "section": "V.6 Thực tập – Khóa luận TN",
    "muc": "V",
    "starred": false,
    "language_code": null
  },
  {
    "code": "ENG4054",
    "name": "Khóa luận tốt nghiệp (hoặc 2 HP thay thế)",
    "credits": 6,
    "category": "Bắt buộc",
    "section": "V.6 Thực tập – Khóa luận TN",
    "muc": "V",
    "starred": false,
    "language_code": null
  }
];
