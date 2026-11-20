import type { FormValues } from '../types';
import type { CatalogCourse } from '../lib/profileLogic';
import { blockMessage, type ElectiveView } from '../lib/electiveRules';
import { SEMESTER_MAX, SEMESTER_MIN } from '../lib/semesterRules';
import { summaryLine } from '../lib/situationLogic';

interface Props {
  values: FormValues;
  question: string;
  selected: string[];
  view: ElectiveView;
  onToggle: (code: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

function CourseRow({
  course,
  checked,
  onToggle,
}: {
  course: CatalogCourse;
  checked: boolean;
  onToggle: (code: string) => void;
}) {
  return (
    <label className="course">
      <input type="checkbox" checked={checked} onChange={() => onToggle(course.code)} />
      <span className="code">{course.code}</span>
      <span className="name">{course.name}</span>
      <span className="tc">{course.credits} TC</span>
    </label>
  );
}

export default function CourseSelectPage({
  values,
  question,
  selected,
  view,
  onToggle,
  onBack,
  onContinue,
}: Props) {
  return (
    <main className="container">
      <header>
        <h1>Đăng ký môn tự chọn</h1>
        <p className="sub">{summaryLine(values)}</p>
      </header>

      {question && (
        <section className="card question">
          <strong>Câu hỏi của bạn:</strong>
          <p>{question}</p>
          <p className="note">Phần trả lời của AI sẽ được thêm sau khi kết nối Dify.</p>
        </section>
      )}

      {view.blocks.map((b) => (
        <section key={b.id} className="card block">
          <h2>
            {b.title} <span className="req">Tự chọn {b.required} TC</span>
          </h2>
          <p className={`status status-${b.status === 'du' ? 'ok' : b.status}`}>
            {blockMessage(b)}
          </p>
          {b.candidates.length === 0 && (
            <p className="note">Không còn môn nào để chọn trong khối này.</p>
          )}
          {b.candidates.map((c) => (
            <CourseRow
              key={c.code}
              course={c}
              checked={selected.includes(c.code)}
              onToggle={onToggle}
            />
          ))}
        </section>
      ))}

      {view.b2.length > 0 && (
        <section className="card block">
          <h2>
            Ngoại ngữ B2 <span className="req">Tự chọn tự do</span>
          </h2>
          <p className="note">
            Không tính vào các khối trên, không tính GPA, không tính học phí.
          </p>
          {view.b2.map((c) => (
            <CourseRow
              key={c.code}
              course={c}
              checked={selected.includes(c.code)}
              onToggle={onToggle}
            />
          ))}
        </section>
      )}

      <section className="card">
        <h2>Tổng tín học kỳ</h2>
        <p className={`status status-${view.semester.status === 'ok' ? 'ok' : view.semester.status}`}>
          Tổng {view.semester.total} TC (đã đăng ký {view.semester.registered} + đang chọn {view.semester.picked}).
          {view.semester.status === 'ok' && ` Nằm trong khoảng ${SEMESTER_MIN}–${SEMESTER_MAX} TC.`}
          {view.semester.status === 'thieu' && ` Còn thiếu ${view.semester.missing} TC để đạt tối thiểu ${SEMESTER_MIN} TC.`}
          {view.semester.status === 'vuot' && ` Vượt ${view.semester.over} TC so với tối đa ${SEMESTER_MAX} TC.`}
        </p>
      </section>

      <div className="actions">
        <button type="button" className="secondary" onClick={onBack}>
          Quay lại
        </button>
        <button type="button" onClick={onContinue}>
          Tiếp tục
        </button>
      </div>
    </main>
  );
}
