// Gọi AI (Dify) qua Supabase Edge Function "ask-dify".
// Frontend không giữ DIFY_API_KEY: khóa nằm trong Supabase Secrets, chỉ function đọc được.
import { supabase } from './supabase';

export interface AskPayload {
  mode: 'analysis' | 'question';   // analysis: diễn đạt kết quả tình huống; question: hỏi thêm
  situation?: string;
  calc?: unknown;                  // dữ liệu đã tính sẵn (số tín, cảnh báo, học trước...)
  question?: string;               // câu hỏi thêm của sinh viên (mode question)
  conversationId?: string | null;  // để Dify nhớ ngữ cảnh các câu hỏi tiếp theo
}

export interface AskReply {
  answer: string;
  conversationId: string | null;
}

// Quá thời gian này thì thôi chờ, để sinh viên vẫn hỏi được (bảng số liệu không đổi)
const TIMEOUT_MS = 60000;

export async function askDify(payload: AskPayload): Promise<AskReply> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error('AI phản hồi quá lâu. Bảng kết quả bên dưới vẫn đúng.')),
      TIMEOUT_MS,
    );
  });
  let result;
  try {
    result = await Promise.race([
      supabase.functions.invoke<AskReply>('ask-dify', { body: payload }),
      timeout,
    ]);
  } finally {
    clearTimeout(timer);
  }
  const { data, error } = result;
  if (error) throw new Error('Chưa kết nối được AI. Bảng kết quả bên dưới vẫn đúng.');
  if (!data || typeof data.answer !== 'string') {
    throw new Error('AI trả về dữ liệu không hợp lệ.');
  }
  return data;
}
