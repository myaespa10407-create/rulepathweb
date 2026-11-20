import { useMemo, useState } from 'react';
import {
  MUCS,
  hasSelectionErrors,
  isVisible,
  matchesSearch,
  requiredByMuc,
  rulesFromInput,
  selectedByMuc,
  validateSelection,
  type CatalogCourse,
  type CourseStatus,
  type Muc,
  type ProfileInput,
  type SelectedCourse,
} from '../lib/profileLogic';

interface Props {
  input: ProfileInput;
  catalog: CatalogCourse[];
  initial: SelectedCourse[];
  mode: 'setup' | 'view';
  onSave: (courses: SelectedCourse[]) => Promise<void>;
  onCancel: () => void;
  onHome?: () => void;
}

interface PickState {
  status: CourseStatus;
  class_code: string;
}

export default function ProfileCoursesPage({
  input,
  catalog,
  initial,
  mode,
  onSave,
  onCancel,
  onHome,
}: Props) {
  const rules = useMemo(() => rulesFromInput(input), [input]);
  const [query, setQuery] = useState('');
  const [picks, setPicks] = useState<Record<string, PickState>>(() => {
    const init: Record<string, PickState> = {};
    for (const c of initial) init[c.code] = { status: c.status, class_code: c.class_code ?? '' };
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const list: SelectedCourse[] = Object.entries(picks).map(([code, p]) => ({
    code,
    status: p.status,
    class_code: p.status === 'registered' ? p.class_code.trim() : null,
  }));

  const required = requiredByMuc(catalog, rules);
  const chosenByMuc = (m: Muc) =>
    selectedByMuc(catalog, list, 'registered')[m] + selectedByMuc(catalog, list, 'completed')[m];

  // Môn hiện theo quy tắc sinh viên, lọc theo từ khóa, nhóm theo mục rồi theo nhóm (section)
  const groups = useMemo(() => {
    const visible = catalog.filter((c) => isVisible(c, rules) && matchesSearch(c, query));
    return MUCS.map((m) => {
      const inMuc = visible.filter((c) => c.muc === m);
      const sections: { title: string; courses: CatalogCourse[] }[] = [];
      for (const c of inMuc) {
        const found = sections.find((s) => s.title === c.section);
        if (found) found.courses.push(c);
        else sections.push({ title: c.section, courses: [c] });
      }
      return { muc: m, sections };
    }).filter((g) => g.sections.length > 0);
  }, [catalog, rules, query]);

  function toggle(code: string) {
    setPicks((prev) => {
      const next = { ...prev };
      if (next[code]) delete next[code];
      else next[code] = { status: 'completed', class_code: '' };
      return next;
    });
  }

  function patch(code: string, p: Partial<PickState>) {
    setPicks((prev) => ({ ...prev, [code]: { ...prev[code], ...p } }));
  }

  async function handleSave() {
    setMessage('');
    const errors = validateSelection(list);
    if (hasSelectionErrors(errors)) {
      const parts: string[] = [];
      if (errors.missingClass.length) {
        parts.push(`Thiếu mã lớp cho: ${errors.missingClass.join(', ')}.`);
      }
      if (errors.duplicate.length) {
        parts.push(`Trùng môn: ${errors.duplicate.join(', ')}.`);
      }
      setMessage(parts.join(' '));
      return;
    }
    setSaving(true);
    try {
      await onSave(list);
    } catch {
      setMessage('Không lưu được. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card">
      {onHome && (
        <button type="button" className="secondary topback" onClick={onHome}>
          ← Quay lại màn hình chính
        </button>
      )}
      <h2>Môn đã học và đã đăng ký (form 1a)</h2>

      <input
        className="question-input"
        type="search"
        placeholder="Tìm theo tên hoặc mã học phần..."
        aria-label="Tìm môn"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {groups.map((g) => {
        const chosen = chosenByMuc(g.muc);
        return (
          <div key={g.muc} className="block">
            <h2>
              Mục {g.muc}{' '}
              <span className="req">
                đã chọn {chosen} / cần {required[g.muc]} TC
              </span>
            </h2>
            {g.sections.map((s) => (
              <div key={s.title}>
                <p className="note"><strong>{s.title}</strong></p>
                {s.courses.map((c) => {
                  const pick = picks[c.code];
                  const mandatoryLang = c.section.startsWith('I. Kiến thức chung') && c.language_code;
                  return (
                    <div key={`${c.code}-${c.section}`} className="course">
                      <label>
                        <input
                          type="checkbox"
                          checked={!!pick}
                          onChange={() => toggle(c.code)}
                        />{' '}
                        <span className="code">{c.code}</span>{' '}
                        <span className="name">{c.name}</span>{' '}
                        <span className="tc">{c.credits} TC</span>
                        {mandatoryLang && <span className="prereq"> · Bắt buộc theo ngôn ngữ thứ hai</span>}
                      </label>
                      {pick && (
                        <div className="pickrow">
                          <label className="radio">
                            <input
                              type="radio"
                              name={`st-${c.code}`}
                              checked={pick.status === 'completed'}
                              onChange={() => patch(c.code, { status: 'completed' })}
                            />
                            Đã học
                          </label>
                          <label className="radio">
                            <input
                              type="radio"
                              name={`st-${c.code}`}
                              checked={pick.status === 'registered'}
                              onChange={() => patch(c.code, { status: 'registered' })}
                            />
                            Đã đăng ký
                          </label>
                          {pick.status === 'registered' && (
                            <input
                              type="text"
                              placeholder="Mã lớp (ví dụ FLF1010.01)"
                              aria-label={`Mã lớp ${c.code}`}
                              value={pick.class_code}
                              onChange={(e) => patch(c.code, { class_code: e.target.value })}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        );
      })}

      {groups.length === 0 && <p className="note">Không có môn nào khớp.</p>}

      {message && <p className="warn" role="alert">{message}</p>}

      <div className="actions">
        <button type="button" className="secondary" onClick={onCancel} disabled={saving}>
          {mode === 'view' ? 'Hủy (giữ thông tin cũ)' : 'Quay lại form 1'}
        </button>
        <button type="button" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu thông tin'}
        </button>
      </div>
    </section>
  );
}
