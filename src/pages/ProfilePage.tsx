import { useState } from 'react';
import { loadAppData, saveAll, type AppData } from '../lib/api';
import {
  MUCS,
  inputFromRow,
  isCounted,
  isVisible,
  requiredByMuc,
  rulesFromInput,
  selectedByMuc,
  type CatalogCourse,
  type CourseStatus,
  type ProfileInput,
  type SelectedCourse,
} from '../lib/profileLogic';
import ProfileFormPage from './ProfileFormPage';
import ProfileCoursesPage from './ProfileCoursesPage';

type Tab = 'registered' | 'completed' | 'edit';
type Step = 'form1' | 'form1a';

interface Props {
  mode: 'setup' | 'view';
  data: AppData;
  onHome?: () => void;
  onChanged: (data: AppData) => void;
}

const TAB_LABELS: Record<Tab, string> = {
  registered: 'Những môn đã đăng ký',
  completed: 'Những môn đã học',
  edit: 'Chỉnh sửa thông tin',
};

export default function ProfilePage({ mode, data, onHome, onChanged }: Props) {
  const [tab, setTab] = useState<Tab>('edit');
  const [step, setStep] = useState<Step>('form1');
  const [draft, setDraft] = useState<ProfileInput | null>(null);

  const saved = inputFromRow(data.profile);
  const current = draft ?? saved;
  const rules = rulesFromInput(saved);

  function switchTab(next: Tab) {
    setTab(next);
    setStep('form1');
    setDraft(null);
  }

  async function handleSave(courses: SelectedCourse[]) {
    await saveAll(data.profile.id, current, courses);
    const fresh = await loadAppData(data.profile.id);
    onChanged(fresh);
    setDraft(null);
    setStep('form1');
    if (mode === 'view') setTab('registered');
  }

  function handleCancelCourses() {
    setDraft(null);
    setStep('form1');
    if (mode === 'view') setTab('registered');
  }

  function renderSummary(status: CourseStatus) {
    const required = requiredByMuc(data.catalog, rules);
    const totals = selectedByMuc(data.catalog, data.courses, status);

    return (
      <>
        {MUCS.filter((m) => required[m] > 0).map((m) => {
          const items = data.courses
            .filter((s) => s.status === status)
            .map((s) => ({
              sel: s,
              course: data.catalog.find(
                (c: CatalogCourse) => c.code === s.code && isCounted(c) && isVisible(c, rules),
              ),
            }))
            .filter((x) => x.course && x.course.muc === m);

          return (
            <div key={m} className="block">
              <h2>
                Mục {m}{' '}
                <span className="req">
                  {totals[m]} / {required[m]} TC
                </span>
              </h2>
              {items.length === 0 && <p className="note">Chưa có môn.</p>}
              {items.map(({ sel, course }) => (
                <div key={sel.code} className="course">
                  <span className="code">{course!.code}</span>{' '}
                  <span className="name">{course!.name}</span>{' '}
                  <span className="tc">{course!.credits} TC</span>
                  {status === 'registered' && (
                    <span className="prereq"> · Lớp: {sel.class_code || 'chưa nhập'}</span>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </>
    );
  }

  function renderEdit() {
    if (step === 'form1a') {
      return (
        <ProfileCoursesPage
          input={current}
          catalog={data.catalog}
          initial={data.courses}
          mode={mode}
          onSave={handleSave}
          onCancel={handleCancelCourses}
          onHome={mode === 'view' ? onHome : undefined}
        />
      );
    }
    return (
      <ProfileFormPage
        key={`form1-${data.profile.id}-${tab}`}
        initial={current}
        onContinue={(input) => {
          setDraft(input);
          setStep('form1a');
        }}
      />
    );
  }

  return (
    <main className="container">
      {mode === 'view' && onHome && (
        <button type="button" className="secondary topback" onClick={onHome}>
          ← Quay lại màn hình chính
        </button>
      )}

      <header>
        <h1>Thông tin của tôi</h1>
        <p className="sub">{data.profile.username}</p>
      </header>

      {mode === 'setup' ? (
        renderEdit()
      ) : (
        <>
          {tab === 'registered' && renderSummary('registered')}
          {tab === 'completed' && renderSummary('completed')}
          {tab === 'edit' && renderEdit()}

          <nav className="tabs" aria-label="Chọn nội dung">
            {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                className={t === tab ? 'tab active' : 'tab'}
                aria-current={t === tab ? 'page' : undefined}
                onClick={() => switchTab(t)}
              >
                {TAB_LABELS[t]}
              </button>
            ))}
          </nav>
        </>
      )}
    </main>
  );
}
