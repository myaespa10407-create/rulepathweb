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

export async function askDify(payload: AskPayload): Promise<AskReply> {
  const { data, error } = await supabase.functions.invoke<AskReply>('ask-dify', {
    body: payload,
  });
  if (error) throw new Error('Chưa kết nối được AI. Bảng kết quả bên dưới vẫn đúng.');
  if (!data || typeof data.answer !== 'string') {
    throw new Error('AI trả về dữ liệu không hợp lệ.');
  }
  return data;
}
