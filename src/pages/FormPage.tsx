import { useState, type FormEvent } from 'react';
import type { FieldName, FormValues } from '../types';
import { FIELD_LABELS, OPTIONS, validateForm } from '../lib/formLogic';

const DEFAULTS: Partial<FormValues> = {
  major: 'NNA',
  cohort: 'QH25',
  track: 'THUONG',
  semester: '1',
  level: '3',
  year: '2026-2027',
};

const FIELDS = Object.keys(FIELD_LABELS) as FieldName[];

interface Props {
  onContinue: (values: FormValues) => void;
}

export default function FormPage({ onContinue }: Props) {
  const [values, setValues] = useState<Partial<FormValues>>(DEFAULTS);

  const { errors, blockers, canProceed } = validateForm(values);

  function handleChange(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (canProceed) onContinue(values as FormValues);
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
    </main>
  );
}
