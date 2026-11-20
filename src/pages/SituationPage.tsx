import { useState } from 'react';
import type { FormValues } from '../types';
import {
  SITUATIONS,
  canContinue,
  needsSituationHint,
  situationNotice,
  summaryLine,
  type SituationId,
} from '../lib/situationLogic';

interface Props {
  values: FormValues;
  onBack?: () => void;
  onContinue: (situation: SituationId, question: string) => void;
}

export default function SituationPage({ values, onBack, onContinue }: Props) {
  const [situation, setSituation] = useState<SituationId | null>(null);
  const [question, setQuestion] = useState('');
  const notice = situationNotice(situation);

  return (
    <main className="container">
      <header>
        <h1>RULEPATH – Trợ lý đăng ký môn tự chọn</h1>
        <p className="sub">{summaryLine(values)}</p>
      </header>

      <section className="card">
        <fieldset className="situations">
          <legend>Bạn cần hỗ trợ việc gì?</legend>
          {SITUATIONS.map((s) => (
            <label key={s.id} className="radio">
              <input
                type="radio"
                name="situation"
                value={s.id}
                checked={situation === s.id}
                onChange={() => setSituation(s.id)}
              />
              {s.label}
            </label>
          ))}
        </fieldset>

        {notice && <p className="warn" role="status">{notice}</p>}

        <h2>Hỏi thêm (không bắt buộc)</h2>
        <input
          className="question-input"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Nhập câu hỏi của bạn..."
          aria-label="Câu hỏi thêm"
        />
        <p className="note">Câu hỏi này sẽ được gửi cùng khi bạn bấm Tiếp tục.</p>
        {needsSituationHint(situation, question) && (
          <p className="warn" role="status">Vui lòng chọn tình huống để tiếp tục.</p>
        )}

        <div className="actions">
          {onBack && (
            <button type="button" className="secondary" onClick={onBack}>
              Quay lại
            </button>
          )}
          <button
            type="button"
            disabled={!canContinue(situation)}
            onClick={() => situation && onContinue(situation, question)}
          >
            Tiếp tục
          </button>
        </div>
      </section>
    </main>
  );
}
