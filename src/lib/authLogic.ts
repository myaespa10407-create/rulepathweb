// Logic đăng ký/đăng nhập thuần (không phụ thuộc giao diện) để dễ kiểm thử.

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const PASSWORD_MIN = 8;

// Email nội bộ: Supabase Auth cần email, sinh viên không thấy email này.
const INTERNAL_DOMAIN = 'rulepath.app';

export interface RegisterValues {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export function toInternalEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${INTERNAL_DOMAIN}`;
}

export function validateUsername(raw: string): string | undefined {
  const username = raw.trim();
  if (username === '') return 'Vui lòng nhập tên đăng nhập.';
  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) {
    return `Tên đăng nhập có từ ${USERNAME_MIN} đến ${USERNAME_MAX} ký tự.`;
  }
  if (!/^[A-Za-z0-9_]+$/.test(username)) {
    return 'Chỉ dùng chữ cái không dấu, số và dấu gạch dưới (_).';
  }
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (password === '') return 'Vui lòng nhập mật khẩu.';
  if (password.length < PASSWORD_MIN) {
    return `Mật khẩu tối thiểu ${PASSWORD_MIN} ký tự.`;
  }
  return undefined;
}

export function validateRegister(values: RegisterValues): RegisterErrors {
  const errors: RegisterErrors = {};
  const usernameError = validateUsername(values.username);
  const passwordError = validatePassword(values.password);
  if (usernameError) errors.username = usernameError;
  if (passwordError) errors.password = passwordError;
  if (!passwordError && values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Mật khẩu nhập lại không khớp.';
  }
  return errors;
}

export function hasErrors(errors: RegisterErrors): boolean {
  return Object.keys(errors).length > 0;
}

// Đổi lỗi kỹ thuật của Supabase thành thông báo tiếng Việt.
export function friendlyAuthError(message: string, mode: 'login' | 'register'): string {
  const text = message.toLowerCase();
  if (mode === 'login') {
    return 'Tên đăng nhập hoặc mật khẩu không đúng.';
  }
  if (text.includes('already') || text.includes('duplicate') || text.includes('unique')) {
    return 'Tên đăng nhập đã có người dùng, vui lòng chọn tên khác.';
  }
  return 'Không thể đăng ký lúc này. Vui lòng thử lại.';
}
