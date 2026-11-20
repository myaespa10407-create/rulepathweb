import { useEffect, useReducer, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import SituationPage from './pages/SituationPage';
import CourseSelectPage from './pages/CourseSelectPage';
import AnalysisPage from './pages/AnalysisPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import { flowReducer, initialFlow, type FlowState } from './lib/flow';
import { supabase } from './lib/supabase';
import { loadAppData, type AppData } from './lib/api';
import { inputFromRow, isProfileComplete, rulesFromInput, toFormValues, type CatalogCourse, type ProfileInput, type SelectedCourse, type StudentRules } from './lib/profileLogic';
import { buildElectiveView } from './lib/electiveRules';
import type { FormValues } from './types';

interface FlowProps {
  values: FormValues;
  input: ProfileInput;
  catalog: CatalogCourse[];
  courses: SelectedCourse[];
  username: string;
  onOpenProfile: () => void;
  onLogout: () => void;
}

// Form 2 là màn hình chính: đăng ký môn tự chọn, có nút "Tôi" mở hồ sơ
function FlowApp({ values, input, catalog, courses, username, onOpenProfile, onLogout }: FlowProps) {
  const rules: StudentRules = rulesFromInput(input);
  const [state, dispatch] = useReducer(
    flowReducer,
    values,
    (v): FlowState => ({ ...initialFlow, screen: 'situation', intake: v }),
  );

  const bar = (
    <div className="userbar">
      <span>Xin chào, {username}</span>
      <div className="actions">
        <button type="button" className="secondary" onClick={onOpenProfile}>
          Tôi
        </button>
        <button type="button" className="secondary" onClick={onLogout}>
          Đăng xuất
        </button>
      </div>
    </div>
  );

  if (state.intake && state.screen === 'analysis') {
    return (
      <>
        {bar}
        <AnalysisPage
          values={state.intake}
          question={state.question}
          selected={state.selected}
          catalog={catalog}
          onBack={() => dispatch({ type: 'back' })}
        />
      </>
    );
  }

  if (state.intake && state.screen === 'elective') {
    return (
      <>
        {bar}
        <CourseSelectPage
          values={state.intake}
          question={state.question}
          selected={state.selected}
          view={buildElectiveView({ catalog, courses, rules, selected: state.selected })}
          onToggle={(code) => dispatch({ type: 'toggleCourse', code })}
          onBack={() => dispatch({ type: 'back' })}
          onContinue={() => dispatch({ type: 'goAnalysis' })}
        />
      </>
    );
  }

  return (
    <>
      {bar}
      <SituationPage
        values={state.intake ?? values}
        onContinue={(question) => dispatch({ type: 'goElective', question })}
      />
    </>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState<AppData | null>(null);
  const [loadError, setLoadError] = useState('');
  const [view, setView] = useState<'home' | 'profile'>('home');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: s }) => {
      setSession(s.session);
      setChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Tải hồ sơ, danh mục môn và môn đã chọn sau khi đăng nhập
  useEffect(() => {
    if (!session) return;
    let active = true;
    loadAppData(session.user.id)
      .then((d) => {
        if (active) {
          setData(d);
          setLoadError('');
        }
      })
      .catch(() => {
        if (active) setLoadError('Không tải được dữ liệu. Vui lòng thử lại.');
      });
    return () => {
      active = false;
    };
  }, [session]);

  if (!checked) {
    return <main className="container"><p>Đang tải...</p></main>;
  }

  if (!session) {
    return <AuthPage />;
  }

  const username = (session.user.user_metadata?.username as string | undefined) ?? 'sinh viên';
  const logout = () => {
    setData(null);
    setView('home');
    supabase.auth.signOut();
  };

  if (loadError) {
    return (
      <main className="container">
        <p className="warn" role="alert">{loadError}</p>
        <button type="button" onClick={() => window.location.reload()}>Thử lại</button>
      </main>
    );
  }

  if (!data) {
    return <main className="container"><p>Đang tải dữ liệu...</p></main>;
  }

  const input = inputFromRow(data.profile);

  // Chưa điền đủ form 1 thì bắt buộc điền trước khi vào form 2
  if (!isProfileComplete(input)) {
    return (
      <>
        <div className="userbar">
          <span>Xin chào, {username}</span>
          <button type="button" className="secondary" onClick={logout}>
            Đăng xuất
          </button>
        </div>
        <ProfilePage mode="setup" data={data} onChanged={setData} />
      </>
    );
  }

  if (view === 'profile') {
    return (
      <ProfilePage
        mode="view"
        data={data}
        onHome={() => setView('home')}
        onChanged={setData}
      />
    );
  }

  const values = toFormValues(input);
  return (
    <FlowApp
      key={JSON.stringify(values)}
      values={values}
      input={input}
      catalog={data.catalog}
      courses={data.courses}
      username={username}
      onOpenProfile={() => setView('profile')}
      onLogout={logout}
    />
  );
}
