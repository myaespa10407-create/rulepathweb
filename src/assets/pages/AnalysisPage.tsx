import type { FormValues } from '../types';
import type { CatalogCourse } from '../lib/profileLogic';
import { summaryLine } from '../lib/situationLogic';

interface Props {
  values: FormValues;
  question: string;
  selected: string[];
  catalog: CatalogCourse[];
  onBack: () => void;
}

// Placeholder cho form 3.3.1 (phân tích kết quả). Sẽ làm ở bước sau.
export default function AnalysisPage({ values, question, selected, catalog, onBack }: Props) {
  const chosen = selected
    .map((code) => catalog.find((c) => c.code === code))
    .filter((c): c is CatalogCourse => c !== undefined);

  return (
    <main className="container">
      <header>
        <h1>Phân tích đăng ký</h1>
        <p className="sub">{summaryLine(values)}</p>
      </header>

      <section className="card">
        <p>Màn hình phân tích kết quả (form 3.3.1) sẽ được làm ở bước sau.</p>

        <h2>Môn đã chọn</h2>
        <ul className="chosen">
          {chosen.map((c) => (
            <li key={c.code}>
              {c.code} – {c.name} ({c.credits} TC)
            </li>
          ))}
        </ul>

        {question && (
          <div className="question">
            <strong>Câu hỏi của bạn:</strong>
            <p>{question}</p>
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
