# Đưa RULEPATH lên Vercel

Chỉ làm sau khi chạy được trên máy (`npm run dev`) và đã hoàn tất Phần A, B, C trong `HUONG-DAN-DIFY-SUPABASE.md`.

## 1. Cấu hình build trên Vercel

Khi import project, Vercel thường tự nhận đúng. Nếu phải điền tay:

| Mục | Giá trị |
|---|---|
| Framework Preset | Vite |
| Root Directory | `.` (thư mục chứa `package.json`) |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js Version | 20 trở lên |

Ứng dụng không dùng router nên không cần file rewrite.

## 2. Biến môi trường (Settings → Environment Variables)

Thêm cho cả **Production** và **Preview**:

- `VITE_SUPABASE_URL` = địa chỉ project Supabase, ví dụ `https://abcd1234.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = anon public key (lấy trong Supabase → Project Settings → API)

**Không** đặt `DIFY_API_KEY` ở Vercel. Khóa đó chỉ nằm trong Supabase Secrets.

## 3. Cho phép đăng nhập trên tên miền mới (Supabase)

Supabase → **Authentication** → **URL Configuration**:

- **Site URL**: `https://<ten-du-an>.vercel.app` (hoặc tên miền riêng khi đã gắn)
- **Redirect URLs**: thêm `https://<ten-du-an>.vercel.app/**`

Nếu thiếu bước này, đăng nhập sẽ báo lỗi chuyển hướng.

## 4. Siết CORS cho Edge Function `ask-dify`

Hiện hàm đang cho mọi nguồn gọi (`*`). Khi đã có địa chỉ chính thức, nên giới hạn lại:

1. Thêm secret: `npx supabase secrets set ALLOWED_ORIGIN=https://<ten-du-an>.vercel.app`
2. Trong `supabase/functions/ask-dify/index.ts`, thay `'Access-Control-Allow-Origin': '*'` bằng giá trị đọc từ `Deno.env.get('ALLOWED_ORIGIN') ?? '*'`.
3. Chạy lại `npx supabase functions deploy ask-dify`.

## 5. Deploy

Cách 1 (khuyến nghị): đưa mã lên GitHub, rồi import repo trong Vercel. Mỗi lần push sẽ tự deploy.

Cách 2: cài CLI rồi chạy trong thư mục project:

```
npx vercel login
npx vercel --prod
```

## 6. Kiểm tra sau khi lên mạng

- Mở địa chỉ Vercel, đăng nhập, chạy đủ luồng form 2 → 3.3 → 3.3.1.
- Chạy lại mục H trong checklist test (`RULEPATH-Checklist-Test.xlsx`).
- Kiểm tra bảng `chat_logs` trong Supabase có dòng mới.

## 7. Trước khi mở cho sinh viên dùng thật

- Thay lớp mô phỏng bằng TKB thật (xem phần A2 trong hướng dẫn Supabase).
- Quyết định ai được đăng ký tài khoản (Supabase → Authentication → Providers/Sign-ups).
- Kiểm tra giới hạn gọi API và chi phí của Dify.
