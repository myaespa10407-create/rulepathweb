import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import {
  friendlyAuthError,
  hasErrors,
  toInternalEmail,
  validatePassword,
  validateRegister,
  validateUsername,
  type RegisterErrors,
} from '../lib/authLogic';

type Mode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setErrors({});
    setServerError('');
  }

  async function handleRegister() {
    const found = validateRegister({ username, password, confirmPassword });
    setErrors(found);
    if (hasErrors(found)) return;

    // Kiểm tra trước để báo nhanh; database vẫn là lớp chặn cuối cùng.
    const { data: available, error: checkError } = await supabase.rpc('is_username_available', {
      name: username.trim(),
    });
    if (checkError) {
      setServerError('Không kiểm tra được tên đăng nhập. Vui lòng thử lại.');
      return;
    }
    if (available === false) {
      setErrors({ username: 'Tên đăng nhập đã có người dùng, vui lòng chọn tên khác.' });
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: toInternalEmail(username),
      password,
      options: { data: { username: username.trim() } },
    });
    if (error) {
      setServerError(friendlyAuthError(error.message, 'register'));
    }
    // Thành công: App sẽ tự chuyển sang form 1 nhờ onAuthStateChange.
  }

  async function handleLogin() {
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    const found: RegisterErrors = {};
    if (usernameError) found.username = usernameError;
    if (passwordError) found.password = passwordError;
    setErrors(found);
    if (hasErrors(found)) return;

    const { error } = await supabase.auth.signInWithPassword({
      email: toInternalEmail(username),
      password,
    });
    if (error) {
      setServerError(friendlyAuthError(error.message, 'login'));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await handleRegister();
      } else {
        await handleLogin();
      }
    } finally {
      setLoading(false);
    }
  }

  const isRegister = mode === 'register';

  return (
    <main className="container">
      <header>
        <h1>RULEPATH</h1>
        <p className="sub">{isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}</p>
      </header>

      <section className="card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <p className="warn">{errors.username}</p>}
          </div>

          <div className="field">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="warn">{errors.password}</p>}
          </div>

          {isRegister && (
            <div className="field">
              <label htmlFor="confirm-password">Nhập lại mật khẩu</label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <p className="warn">{errors.confirmPassword}</p>}
            </div>
          )}

          {serverError && (
            <p className="warn" role="alert">
              {serverError}
            </p>
          )}

          <div className="actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Vui lòng chờ...' : isRegister ? 'Đăng ký' : 'Đăng nhập'}
            </button>
          </div>
        </form>

        <p className="note">
          {isRegister ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
          <button type="button" className="link" onClick={() => switchMode(isRegister ? 'login' : 'register')}>
            {isRegister ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </p>
      </section>
    </main>
  );
}
