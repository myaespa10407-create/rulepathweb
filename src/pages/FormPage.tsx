import { useState, type FormEvent } from 'react';
import type { FieldName, FormValues } from '../types';
import {
  FIELD_LABELS,
  OPTIONS,
  getCourseGroup,
  totalCredits,
  validateForm,
} from '../lib/formLogic';

const DEFAULTS: Partial<FormValues> = {
  major: 'NNA',
  cohort: 'QH25',
  track: 'THUONG',
  semester: '1',
  level: '3',
  year: '2026-2027',
};

const FIELDS = Object.keys(FIELD_LABELS) as FieldName[];

export default function FormPage() {
  const [values, setValues] = useState<Partial<FormValues>>(DEFAULTS);
  const [submitted, setSubmitted] = useState(false);

  const { errors, blockers, canProceed } = validateForm(values);
  const courses = values.level ? getCourseGroup(values.level) : null;

  function handleChange(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setSubmitted(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (canProceed) setSubmitted(true);
  }

  return (
    <main className="container">
      <header>
        <h1>RULEPATH – Trợ lý đăng ký môn tự chọn</h1>
        <p className="sub">Phiên bản MVP · Ngôn ngữ Anh · QH2025 · Học kỳ 1 · Hệ Thường</p>
      </header>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="grid">
          {FIELDS.map((name) => (
            <label key={name}>
              {FIELD_LABELS[name]}
              <select
                value={values[name] ?? ''}
                onChange={(e) => handleChange(name, e.target.value)}
              >
                <option value="">-- Chọn --</option>
                {OPTIONS[name].map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        {Object.values(errors).map((msg) => (
          <p key={msg} className="error" role="alert">{msg}</p>
        ))}
        {blockers.map((msg) => (
          <p key={msg} className="warn" role="status">{msg}</p>
        ))}

        <button type="submit" disabled={!canProceed}>
          Tiếp tục
        </button>
      </form>

      {submitted && courses && values.level && (
        <section className="card result">
          <h2>Thông tin đã nhập</h2>
          <dl>
            {FIELDS.map((name) => (
              <div key={name} className="row">
                <dt>{FIELD_LABELS[name]}</dt>
                <dd>{OPTIONS[name].find((o) => o.value === values[name])?.label}</dd>
              </div>
            ))}
          </dl>

          <h3>Học phần bắt buộc khối IV.1 (bậc {values.level})</h3>
          <table>
            <thead>
              <tr><th>Mã HP</th><th>Tên học phần</th><th>TC</th></tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.code}>
                  <td>{c.code}</td>
                  <td>{c.name}</td>
                  <td>{c.credits}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><td colSpan={2}>Tổng</td><td>{totalCredits(courses)}</td></tr>
            </tfoot>
          </table>
          <p className="note">Kết quả chỉ mang tính tham khảo, cần đối chiếu cổng đăng ký chính thức.</p>
        </section>
      )}
    </main>
  );
}