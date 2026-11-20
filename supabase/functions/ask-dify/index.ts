// Edge Function "ask-dify": cầu nối giữa web RULEPATH và Dify.
// - Chỉ người đã đăng nhập Supabase mới gọi được (kiểm tra JWT).
// - DIFY_API_KEY nằm trong Supabase Secrets, không lộ ra trình duyệt.
// - Ghi nhật ký vào bảng chat_logs (bước N8 trong Quy trình).
import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MAX_QUESTION = 1000;
const MAX_CALC_CHARS = 20000;

// Lời dặn cho Dify ở dạng biến đầu vào. Prompt đầy đủ đặt trong Dify (mục 9.2 Quy trình).
const ANALYSIS_QUERY = 'Hãy diễn đạt kết quả đăng ký môn tự chọn dưới đây theo mẫu đã cấu hình. Không tự tính lại số tín.';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const difyKey = Deno.env.get('DIFY_API_KEY');
  const difyBase = (Deno.env.get('DIFY_BASE_URL') ?? 'https://api.dify.ai/v1').replace(/\/$/, '');
  if (!difyKey) return json({ error: 'missing_dify_key' }, 500);

  // Xác thực người dùng bằng token họ gửi lên
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } },
  );
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return json({ error: 'unauthorized' }, 401);
  const userId = userData.user.id;

  let body: {
    mode?: string;
    situation?: string;
    calc?: unknown;
    question?: string;
    conversationId?: string | null;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_json' }, 400);
  }

  const mode = body.mode === 'question' ? 'question' : 'analysis';
  const question = String(body.question ?? '').trim().slice(0, MAX_QUESTION);
  if (mode === 'question' && question === '') return json({ error: 'empty_question' }, 400);

  const calcText = JSON.stringify(body.calc ?? {});
  if (calcText.length > MAX_CALC_CHARS) return json({ error: 'calc_too_large' }, 413);

  const query = mode === 'analysis' ? ANALYSIS_QUERY : question;
  const payload: Record<string, unknown> = {
    inputs: {
      mode,
      situation: String(body.situation ?? ''),
      calc_json: calcText,
    },
    query,
    response_mode: 'blocking',
    user: userId,
  };
  if (body.conversationId) payload.conversation_id = body.conversationId;

  let difyRes: Response;
  try {
    difyRes = await fetch(`${difyBase}/chat-messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${difyKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    return json({ error: 'dify_unreachable' }, 502);
  }
  if (!difyRes.ok) {
    return json({ error: 'dify_error', status: difyRes.status }, 502);
  }

  const out = (await difyRes.json()) as { answer?: string; conversation_id?: string };
  const answer = out.answer ?? '';

  // Ghi nhật ký (N8). Lỗi ghi nhật ký không làm hỏng câu trả lời.
  await supabase.from('chat_logs').insert({
    user_id: userId,
    session_id: out.conversation_id ?? null,
    input_json: { mode, situation: body.situation ?? null, question: question || null },
    output_text: answer,
  });

  return json({ answer, conversationId: out.conversation_id ?? null });
});
