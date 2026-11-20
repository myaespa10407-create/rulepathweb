import { useState } from 'react';
import {
  LANGUAGE_OPTIONS,
  TRACK_OPTIONS,
  validateProfileInput,
  type ProfileInput,
  type Track,
} from '../lib/profileLogic';

interface Props {
  initial: ProfileInput;
  onContinue: (input: ProfileInput) => void;
  onCancel?: () => void;
}

export default function ProfileFormPage({ initial, onContinue, onCancel }: Props) {
  const [input, setInput] = useState<ProfileInput>(initial);
  const [submitted, setSubmitted] = useState(false);
  const errors = validateProfileInput(input);
  const showErrors = submitted;

  function update(patch: Partial<ProfileInput>) {
    setInput((prev) => {
      const next = { ...prev, ...patch };
      // Năm 1–2 không có hướng Mục V
      if (next.yearOfStudy === null || next.yearOfStudy < 3) next.muc5Track = null;
      // Tiếng Việt chỉ cho sinh viên nước ngoài
      if (!next.isInternational && next.secondLanguage === 'VI') next.secondLanguage = null;
      return next;
    });
  }

  function handleContinue() {
    setSubmitted(true);
    if (Object.keys(errors).length === 0) onContinue(input);
  }

  const showTrack = input.yearOfStudy !== null && input.yearOfStudy >= 3;
  const languages = LANGUAGE_OPTIONS.filter((l) => l.value !== 'VI' || input.isInternational);

  return (
    <section className="card">
      <h2>Thông tin cá nhân (form 1)</h2>

      <div className="field">
        <label>Ngành</label>
        <input value="Ngôn ngữ Anh" disabled />
      </div>

      <div className="field">
        <label>Khóa</label>
        <input value="QH2025 (QH25)" disabled />
      </div>

      <div className="field">
        <label htmlFor="track">Hệ</label>
        <select id="track" value={input.track} onChange={(e) => update({ track: e.target.value })}>
          <option value="THUONG">Thường</option>
          <option value="BRT">BRT</option>
        </select>
        {showErrors && errors.track && <p className="warn">{errors.track}</p>}
      </div>

      <div className="field">
        <label htmlFor="semester">Học kỳ</label>
        <select
          id="semester"
          value={input.semester}
          onChange={(e) => update({ semester: e.target.value })}
        >
          <option value="1">Học kỳ 1</option>
          <option value="2">Học kỳ 2</option>
        </select>
        {showErrors && errors.semester && <p className="warn">{errors.semester}</p>}
      </div>

      <div className="field">
        <label>Năm học</label>
        <input value="2026-2027" disabled />
      </div>

      <div className="field">
        <label htmlFor="year">Năm học thứ mấy</label>
        <select
          id="year"
          value={input.yearOfStudy ?? ''}
          onChange={(e) =>
            update({ yearOfStudy: e.target.value ? (Number(e.target.value) as 1 | 2 | 3 | 4) : null })
          }
        >
          <option value="">-- Chọn --</option>
          <option value="1">Năm 1</option>
          <option value="2">Năm 2</option>
          <option value="3">Năm 3</option>
          <option value="4">Năm 4</option>
        </select>
        {showErrors && errors.yearOfStudy && <p className="warn">{errors.yearOfStudy}</p>}
      </div>

      <div className="field">
        <label htmlFor="level">Bậc (ngôn ngữ thứ nhất: Tiếng Anh)</label>
        <select
          id="level"
          value={input.level ?? ''}
          onChange={(e) => update({ level: (e.target.value || null) as ProfileInput['level'] })}
        >
          <option value="">-- Chọn --</option>
          <option value="3">Bậc 3</option>
          <option value="4">Bậc 4</option>
          <option value="5">Bậc 5</option>
        </select>
        {showErrors && errors.level && <p className="warn">{errors.level}</p>}
      </div>

      <div className="field">
        <label>Ngôn ngữ thứ nhất</label>
        <input value="Tiếng Anh" disabled />
      </div>

      <div className="field">
        <label htmlFor="second">Ngôn ngữ thứ hai (bắt buộc)</label>
        <select
          id="second"
          value={input.secondLanguage ?? ''}
          onChange={(e) => update({ secondLanguage: e.target.value || null })}
        >
          <option value="">-- Chọn --</option>
          {languages.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
        {showErrors && errors.secondLanguage && <p className="warn">{errors.secondLanguage}</p>}
      </div>

      <label className="radio">
        <input
          type="checkbox"
          checked={input.isInternational}
          onChange={(e) => update({ isInternational: e.target.checked })}
        />
        Tôi là sinh viên nước ngoài
      </label>

      {showTrack && (
        <div className="field">
          <label htmlFor="muc5">Hướng Mục V</label>
          <select
            id="muc5"
            value={input.muc5Track ?? ''}
            onChange={(e) => update({ muc5Track: (e.target.value || null) as Track | null })}
          >
            <option value="">-- Chọn hướng --</option>
            {(Object.keys(TRACK_OPTIONS) as Track[]).map((t) => (
              <option key={t} value={t}>
                {t} – {TRACK_OPTIONS[t]}
              </option>
            ))}
          </select>
          {showErrors && errors.muc5Track && <p className="warn">{errors.muc5Track}</p>}
        </div>
      )}

      <div className="actions">
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Hủy
          </button>
        )}
        <button type="button" onClick={handleContinue}>
          Tiếp tục
        </button>
      </div>
    </section>
  );
}
