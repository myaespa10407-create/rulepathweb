# Hướng dẫn nối Supabase và Dify (RULEPATH)

Làm theo đúng thứ tự. Mỗi bước có cách kiểm tra. Nếu bước nào không khớp, dừng lại và gửi ảnh màn hình.

Luồng dữ liệu:

```
Trình duyệt (React)  →  Supabase Edge Function "ask-dify"  →  Dify (Chatflow)
                              ↓
                       Supabase: bảng chat_logs (nhật ký)
```

Trình duyệt không bao giờ thấy khóa Dify. Khóa nằm trong Supabase Secrets.

---

## Phần A. Supabase

### A1. Chạy migration v4
1. Mở Supabase → **SQL Editor** → **New query**.
2. Mở file `supabase-setup/migration-v4-classes-chat.sql`, copy toàn bộ, dán vào, bấm **Run**.
3. Kiểm tra: kết quả cuối cùng có hai dòng `lop_mo` và `nhat_ky_chat`. Lúc này `lop_mo = 0` và `nhat_ky_chat = 0`.

### A2. Import lớp mở mô phỏng
1. Supabase → **Table Editor** → chọn bảng **course_classes**.
2. Bấm **Insert** → **Import data from CSV**, chọn file `supabase-setup/open_classes_sim.csv`, bấm **Import**.
3. Kiểm tra: chạy lại `select count(*) from course_classes;` trong SQL Editor. Kết quả phải là **45**.

Khi có dữ liệu TKB thật, xóa dữ liệu mô phỏng rồi import lại:
```sql
delete from public.course_classes where source = 'simulated';
```

### A3. Cài và đăng nhập Supabase CLI (làm trong terminal của VS Code)
Đứng ở thư mục project `rulepath-web` rồi chạy từng lệnh:

1. `npx supabase login`
   Trình duyệt sẽ mở ra để bạn xác nhận. Quay lại VS Code sau khi xác nhận.
2. `npx supabase init`
   Nếu hỏi về VS Code settings, gõ `n`. Lệnh này tạo `supabase/config.toml`. Các file đã có sẽ không bị ghi đè.
3. Lấy mã project: mở file `.env.local`, đoạn giữa `https://` và `.supabase.co` trong `VITE_SUPABASE_URL` chính là mã project. Ví dụ `https://abcd1234.supabase.co` thì mã là `abcd1234`.
4. `npx supabase link --project-ref abcd1234`
   Khi hỏi mật khẩu database, nhập mật khẩu bạn đã đặt lúc tạo project Supabase.

Kiểm tra: lệnh `npx supabase projects list` hiện project của bạn với dấu chọn ở cột LINKED.

### A4. Đặt khóa Dify vào Supabase Secrets
Làm sau khi có khóa ở Phần B (bước B6). Thay giá trị thật:

```
npx supabase secrets set DIFY_API_KEY=app-xxxxxxxxxxxx DIFY_BASE_URL=https://api.dify.ai/v1
```

- `DIFY_API_KEY`: khóa của **App** Chatflow (bắt đầu bằng `app-`), không phải khóa của workspace.
- `DIFY_BASE_URL`: với Dify Cloud dùng `https://api.dify.ai/v1`. Nếu tự cài Dify, dùng địa chỉ của bạn kèm `/v1`, ví dụ `https://dify.truong.edu.vn/v1`. Địa chỉ này phải truy cập được từ internet.

Kiểm tra: `npx supabase secrets list` phải thấy `DIFY_API_KEY` và `DIFY_BASE_URL` (giá trị bị ẩn là bình thường).

### A5. Đưa Edge Function lên Supabase
Chạy trong thư mục project:

```
npx supabase functions deploy ask-dify
```

Kết quả đúng là dòng `Deployed Functions on project ...: ask-dify`.

Kiểm tra: Supabase → **Edge Functions** → `ask-dify` hiện trạng thái Active.

---

## Phần B. Dify

### B0. Cách nhanh: import file DSL (khuyến nghị)
1. Dify → **Studio** → **Import DSL file** → chọn file `RULEPATH-Dify-Chatflow.yml`.
2. Mở node **Diễn đạt kết quả** (LLM) → chọn lại **model** và API key của nhà cung cấp bạn đã cấu hình trong Dify (file đặt sẵn OpenAI gpt-4o-mini; nếu không có, chọn model khác).
3. Bỏ qua B1–B4 bên dưới, chuyển sang B5 (Preview) và B6 (khóa API).

Nếu Dify báo lỗi khi import, chụp màn hình thông báo và gửi cho mình.

### B0b. Tạo kho tri thức (Knowledge) cho bước "Tra cứu quy chế"
File DSL có sẵn node **Tra cứu quy chế**, nhưng chưa chọn kho nào. Bạn phải tự tạo kho rồi gắn vào node:

1. Dify → **Knowledge** → **Create Knowledge** → **Import from file**. Tải lên các file sau:
   - Khung CTĐT ngành Ngôn ngữ Anh (file `Signed.Signed.7.-Ngôn-ngữ-Anh_compressed.pdf` trong Project).
   - Quyết định học phí 2026–2027 (file `Quyet-dinh-muc-hoc-phi-tu-nam-2026-va-nam-hoc-2026-2027.pdf`).
   - Thông báo đăng ký học phần (file `TB-1848-22.8.2026...pdf`). Lưu ý: thông báo này dành cho khóa QH2026.F1, không phải QH25.
   - **Quy định 14–55 tín chỉ mỗi học kỳ của Phòng Đào tạo.** Văn bản này hiện chưa có trong Project, bạn cần xin và tải lên.
2. Chọn chế độ chia đoạn (Indexing) **High quality**, bấm **Save & Process** và chờ trạng thái Available.
3. Trong Chatflow, mở node **Tra cứu quy chế** → **Knowledge** → chọn kho vừa tạo → bấm **Publish**.

Không đưa file **Quy trình triển khai RULEPATH** vào kho. Tài liệu này không phải văn bản quy chế.

### B1. Tạo ứng dụng Chatflow (làm tay, nếu không dùng file DSL)
1. Đăng nhập Dify (cloud.dify.ai hoặc địa chỉ bạn tự cài).
2. **Studio** → **Create from Blank** → chọn **Chatflow** → đặt tên `RULEPATH`.

### B2. Khai báo biến đầu vào ở node Start
Bấm node **Start** → **Input Field** → thêm lần lượt ba biến. Tên phải viết đúng từng chữ, vì web gửi đúng tên này:

| Tên biến (Variable name) | Kiểu | Bắt buộc |
|---|---|---|
| `mode` | Text | Không |
| `situation` | Text | Không |
| `calc_json` | Paragraph | Có |

### B3. Thêm node LLM
1. Nối node **Start** → **LLM**. Chọn model (ví dụ Claude hoặc GPT).
2. Ở ô **System**, dán toàn bộ prompt mục 9.2 của tài liệu Quy trình RULEPATH, rồi thêm đoạn sau ở cuối:

```
Dữ liệu đã được hệ thống tính sẵn nằm trong JSON sau. Chỉ diễn đạt lại, không tự tính số tín,
không tự thêm môn hay mã lớp không có trong JSON.
Nếu mode = "analysis": trình bày theo đúng mẫu 9.2 (Kết luận, Chi tiết theo khối, Cảnh báo, Hệ quả, Việc cần làm, Nguồn).
Nếu mode = "question": trả lời câu hỏi của sinh viên dựa trên JSON. Nếu JSON không có thông tin, nói "Chưa đủ dữ liệu" và hướng dẫn liên hệ Phòng Đào tạo.
Luôn kết thúc bằng: "Kết quả chỉ mang tính tham khảo, cần đối chiếu cổng đăng ký chính thức."
```

3. Ở ô **User**, gõ `Chế độ: ` rồi chọn biến `mode` từ danh sách biến (gõ `/` để mở). Xuống dòng, gõ `Dữ liệu: ` rồi chọn biến `calc_json`. Xuống dòng, gõ `Câu hỏi: ` rồi chọn biến hệ thống `sys.query`.

### B4. Thêm node Answer
Nối node **LLM** → **Answer**. Ở ô nội dung trả lời, chọn đầu ra **text** của node LLM.

### B5. Thử trong Preview
1. Bấm **Preview** (góc trên).
2. Ở ô biến, điền `mode` = `analysis`, `calc_json` = `{"semester":{"total":9,"min":14,"max":55,"status":"thieu"},"blocks":[],"warnings":[{"severity":"luu_y","text":"Tổng 9 TC, còn thiếu 5 TC"}],"sources":["SEMESTER"]}`.
3. Gửi một tin bất kỳ. Phải có câu trả lời nhắc đến "9 TC" và "thiếu 5 TC".
4. Bấm **Publish** (góc trên bên phải). Dify chỉ cho gọi API khi app đã Publish.

### B6. Lấy khóa API
**Access API** (hoặc **API Access**) → sao chép **API Key** (dạng `app-...`) và **Base URL**. Đây là hai giá trị dùng ở bước A4.

---

## Phần C. Kiểm tra toàn tuyến

1. Chạy web: `npm run dev`, đăng nhập bằng tài khoản thử.
2. Vào form 2 → chọn **Đăng ký môn tự chọn** → chọn vài môn → **Tiếp tục**.
3. Ở màn hình kết quả, phải thấy dòng **"Đang tạo phần diễn đạt..."**, sau đó là đoạn văn do AI viết.
4. Gõ một câu hỏi ở mục **8. Hỏi thêm (AI)** → **Gửi câu hỏi**. Phải có câu trả lời.
5. Supabase → **Table Editor** → bảng **chat_logs**: có thêm dòng mới với `user_id` của bạn.

### Bảng lỗi thường gặp

| Thông báo trên web | Nguyên nhân | Cách sửa |
|---|---|---|
| "Chưa kết nối được AI" | Chưa deploy hoặc chưa đặt secrets | Làm lại A4 và A5. Xem log ở Supabase → Edge Functions → ask-dify → Logs |
| Log ghi `missing_dify_key` | Chưa đặt `DIFY_API_KEY` | Chạy lại lệnh `secrets set` ở A4 |
| Log ghi `dify_error` status 400 | Tên biến trong Dify không khớp (`mode`, `situation`, `calc_json`) hoặc biến bắt buộc đang trống | Kiểm tra lại B2 và viết đúng từng chữ |
| Log ghi `dify_error` status 401 | Sai khóa API hoặc khóa của workspace | Lấy lại khóa `app-...` ở B6 |
| Log ghi `dify_unreachable` | Sai `DIFY_BASE_URL` hoặc Dify tự cài không truy cập được từ internet | Kiểm tra địa chỉ, thêm `/v1` ở cuối |
| "Bạn cần đăng nhập" hoặc `unauthorized` | Phiên đăng nhập đã hết | Đăng xuất rồi đăng nhập lại |

---

## Ghi chú

- Mỗi câu hỏi thêm được gửi cùng `conversation_id`, nên Dify nhớ ngữ cảnh trong cùng một lần phân tích.
- Số tín và cảnh báo luôn được tính trong code. Dify chỉ diễn đạt lại số đã tính.
- Muốn đổi prompt, chỉ sửa trong Dify rồi bấm Publish. Không cần deploy lại.
