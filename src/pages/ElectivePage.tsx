import type { FormValues } from '../types';
import { summaryLine } from '../lib/situationLogic';

interface Props {
  values: FormValues;
  question: string;
  onBack: () => void;
}

// Placeholder cho form 3.3 (chọn môn tự chọn). Sẽ làm ở bước sau.
export default function ElectivePage({ values, question, onBack }: Props) {
  return (
    <main className="container">
      <header>
        <h1>Đăng ký môn tự chọn</h1>
        <p className="sub">{summaryLine(values)}</p>
      </header>

      <section className="card">
        <p>Màn hình chọn môn tự chọn (form 3.3) sẽ được làm ở bước sau.</p>

        {question && (
          <div className="question">
            <strong>Câu hỏi của bạn:</strong>
            <p>{question}</p>
            <p className="note">Phần trả lời của AI sẽ được thêm sau khi kết nối Dify.</p>
          </div>
        )}

        <div className="actions">
          <button type="button" className="secondary" onClick={onBack}>
            Quay lại
          </button>
        </div>
      </section>
    </main>
  );
}
