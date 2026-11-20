import { useEffect, useRef, useState } from 'react';
import type { FormValues } from '../types';
import {
  DISCLAIMER,
  buildCalcPayload,
  statusText,
  type AnalysisResult,
  type ChosenCourse,
} from '../lib/analysisLogic';
import { askDify } from '../lib/dify';
import { BLOCK_TITLES, type ElectiveBlock } from '../lib/electiveRules';
import { SEMESTER_MAX, SEMESTER_MIN } from '../lib/semesterRules';
import { summaryLine } from '../lib/situationLogic';

interface Props {
  values: FormValues;
  result: AnalysisResult;
  onBack: () => void;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

const BLOCK_ORDER: ElectiveBlock[] = ['II.2', 'III.2', 'IV.2.2'];

function CourseLine({ c }: { c: ChosenCourse }) {
  return (
    <li>
      <span className="code">{c.code}</span> – {c.name} ({c.credits} TC)
      {c.language_code && <span className="note"> · Ngôn ngữ: {c.language_code}</span>}
    </li>
  );
}

// Form 3.3.1: số liệu tính trong code, phần diễn đạt và hỏi thêm qua Dify
export default function AnalysisPage({ values, result, onBack }: Props) {
  const { semester, blocks, chosen, b2, conclusion, warnings, consequences, prereqs, suggestions, nextSteps, sources } =
    result;

  const [narrative, setNarrative] = useState<string>('');
  const [aiError, setAiError] = useState<string>('');
  const [aiBusy, setAiBusy] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const started = useRef(false);
  const calc = buildCalcPayload(result);

  // Gọi Dify một lần khi vào màn hình (React StrictMode có thể chạy effect hai lần)
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    // Câu hỏi nhập ở màn hình trước được gửi ngay sau phần phân tích, để AI trả lời
    const pending = result.question?.trim() ?? '';
    (async () => {
      let convId: string | null = null;
      try {
        const r = await askDify({ mode: 'analysis', situation: result.situationLabel, calc });
        setNarrative(r.answer);
        convId = r.conversationId;
        setConversationId(convId);
      } catch (e) {
        setAiError((e as Error).message);
      }
      if (pending) {
        setMessages([{ role: 'user', text: pending }]);
        try {
          const q = await askDify({ mode: 'question', question: pending, calc, conversationId: convId });
          setConversationId(q.conversationId ?? convId);
          setMessages((m) => [...m, { role: 'ai', text: q.answer }]);
        } catch (e) {
          setMessages((m) => [...m, { role: 'ai', text: (e as Error).message }]);
        }
      }
      setAiBusy(false);
    })();
    // Chỉ gọi khi mới vào màn hình (dữ liệu tính không đổi trong lúc xem)
  }, []);

  async function sendQuestion() {
    const q = draft.trim();
    // Chờ phần phân tích xong để câu hỏi nằm cùng cuộc hội thoại với kết quả
    if (!q || sending || aiBusy) return;
    setDraft('');
    setSending(true);
    setMessages((m) => [...m, { role: 'user', text: q }]);
    try {
      const r = await askDify({ mode: 'question', question: q, calc, conversationId });
      setConversationId(r.conversationId ?? conversationId);
      setMessages((m) => [...m, { role: 'ai', text: r.answer }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'ai', text: (e as Error).message }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="container">
      <header>
        <h1>Kết quả đăng ký (form 3.3.1)</h1>
        <p className="sub">{summaryLine(values)}</p>
      </header>

      {/* 1. Tóm tắt */}
      <section className="card">
        <h2>1. Tóm tắt</h2>
        <p>
          Tình huống: <strong>{result.situationLabel}</strong>
        </p>
        <p>
          Đã đăng ký: {semester.registered} TC · Đang chọn: {semester.picked} TC · Tổng học kỳ:{' '}
          <strong>{semester.total} TC</strong> (cho phép {SEMESTER_MIN}–{SEMESTER_MAX} TC)
        </p>
        {result.question && (
          <div className="question">
            <strong>Câu hỏi của bạn:</strong>
            <p>{result.question}</p>
          </div>
        )}

        {/* 2. Kết luận */}
        <h2>2. Kết luận</h2>
        <p><strong>{conclusion}</strong></p>
        {aiBusy && <p className="note">Đang tạo phần diễn đạt...</p>}
        {narrative && <div className="ai-answer">{narrative}</div>}
        {aiError && <p className="note">{aiError}</p>}

        {/* 3. Chi tiết theo khối */}
        <h2>3. Chi tiết theo khối</h2>
        <table className="result-table">
          <thead>
            <tr>
              <th>Khối</th>
              <th>Đã đăng ký/học</th>
              <th>Đang chọn</th>
              <th>Quy định</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((b) => (
              <tr key={b.id}>
                <td>{BLOCK_TITLES[b.id]}</td>
                <td>{b.done} TC</td>
                <td>{b.picked} TC</td>
                <td>{b.required} TC</td>
                <td>
                  <span className={`status status-${b.status === 'du' ? 'ok' : b.status}`}>
                    {statusText(b)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="note">
          Tổng tín học kỳ: {semester.total} TC (đăng ký {semester.registered} + đang chọn {semester.picked}).
          Mức cho phép trong một học kỳ: {SEMESTER_MIN}–{SEMESTER_MAX} TC. Học phần B2 không tính vào tổng này.
        </p>

        {BLOCK_ORDER.map((id) => {
          const items = chosen.filter((c) => c.block === id);
          if (items.length === 0) return null;
          return (
            <div key={id}>
              <p className="note"><strong>Môn đã chọn – {BLOCK_TITLES[id]}</strong></p>
              <ul className="chosen">
                {items.map((c) => <CourseLine key={c.code} c={c} />)}
              </ul>
            </div>
          );
        })}
        {b2.length > 0 && (
          <div>
            <p className="note"><strong>Ngoại ngữ B2 (không tính GPA, không tính học phí)</strong></p>
            <ul className="chosen">
              {b2.map((c) => <CourseLine key={c.code} c={c} />)}
            </ul>
          </div>
        )}
        {chosen.length === 0 && b2.length === 0 && <p className="note">Chưa chọn môn nào.</p>}

        {/* 4. Cảnh báo */}
        <h2>4. Cảnh báo</h2>
        {warnings.length === 0 && <p className="note">Không có cảnh báo.</p>}
        {warnings.length > 0 && (
          <ul className="warnings">
            {warnings.map((w, i) => (
              <li key={i} className={w.severity === 'nghiem_trong' ? 'warn' : 'note'}>
                <strong>{w.severity === 'nghiem_trong' ? 'Nghiêm trọng:' : 'Lưu ý:'}</strong> {w.text}
                <div className="note">Nguồn: {w.source}</div>
              </li>
            ))}
          </ul>
        )}

        {/* 5. Hệ quả */}
        <h2>5. Hệ quả</h2>
        <h3>Điều kiện học trước</h3>
        {prereqs.length === 0 && <p className="note">Các môn đã chọn không có học trước.</p>}
        {prereqs.length > 0 && (
          <ul>
            {prereqs.map((p, i) => (
              <li key={i} className={p.ok ? '' : 'warn'}>
                {p.ok ? '✔ ' : '✘ '}
                {p.text}
              </li>
            ))}
          </ul>
        )}
        <h3>GPA, học phí và vượt tín</h3>
        <ul>
          {consequences.map((t, i) => <li key={i}>{t}</li>)}
        </ul>

        {/* 6. Gợi ý các môn đăng ký lần sau */}
        <h2>6. Gợi ý các môn đăng ký lần sau</h2>
        <p className="note">Chỉ gồm các môn đang mở đăng ký trong TKB chung.</p>
        {suggestions.length === 0 && <p className="note">Chưa có gợi ý.</p>}
        {suggestions.length > 0 && (
          <ul>
            {suggestions.map((s) => (
              <li key={s.code}>
                <span className="code">{s.code}</span> – {s.name} ({s.credits} TC)
                <div className="note">{s.reason}</div>
              </li>
            ))}
          </ul>
        )}

        {/* 7. Việc cần làm */}
        <h2>7. Việc cần làm</h2>
        <ol>
          {nextSteps.map((t, i) => <li key={i}>{t}</li>)}
        </ol>

        <h2>Nguồn</h2>
        <ul className="note">
          {sources.map((s, i) => <li key={i}>{s}</li>)}
        </ul>

        {/* 8. Hỏi thêm (AI) */}
        <h2>8. Hỏi thêm (AI)</h2>
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'question' : 'ai-answer'}>
            <strong>{m.role === 'user' ? 'Bạn:' : 'RULEPATH:'}</strong>
            <p>{m.text}</p>
          </div>
        ))}
        <textarea
          rows={3}
          placeholder="Hỏi thêm về kết quả này"
          aria-label="Câu hỏi thêm cho AI"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          style={{ width: '100%' }}
        />
        {aiBusy && <p className="note">Chờ phần phân tích AI xong rồi mới hỏi thêm.</p>}
        <div className="actions">
          <button type="button" onClick={sendQuestion} disabled={sending || aiBusy || draft.trim() === ''}>
            {sending ? 'Đang trả lời...' : 'Gửi câu hỏi'}
          </button>
        </div>

        <p className="note">{DISCLAIMER}</p>

        <div className="actions">
          <button type="button" className="secondary" onClick={onBack}>
            Quay lại form 3.3
          </button>
        </div>
      </section>
    </main>
  );
}
