import { describe, it, expect } from 'vitest';
import {
  friendlyAuthError,
  hasErrors,
  toInternalEmail,
  validatePassword,
  validateRegister,
  validateUsername,
} from './authLogic';

describe('validateUsername', () => {
  it('bắt buộc nhập', () => {
    expect(validateUsername('   ')).toBeDefined();
  });

  it('độ dài từ 3 đến 20', () => {
    expect(validateUsername('ab')).toBeDefined();
    expect(validateUsername('abc')).toBeUndefined();
    expect(validateUsername('a'.repeat(20))).toBeUndefined();
    expect(validateUsername('a'.repeat(21))).toBeDefined();
  });

  it('chỉ cho chữ không dấu, số và gạch dưới', () => {
    expect(validateUsername('nguyen_an1')).toBeUndefined();
    expect(validateUsername('nguyễn')).toBeDefined();
    expect(validateUsername('an nguyen')).toBeDefined();
    expect(validateUsername('an@mail')).toBeDefined();
  });
});

describe('validatePassword', () => {
  it('tối thiểu 8 ký tự', () => {
    expect(validatePassword('')).toBeDefined();
    expect(validatePassword('1234567')).toBeDefined();
    expect(validatePassword('12345678')).toBeUndefined();
  });
});

describe('validateRegister', () => {
  it('hợp lệ khi tên, mật khẩu đúng và nhập lại khớp', () => {
    const errors = validateRegister({
      username: 'an_01',
      password: 'matkhau123',
      confirmPassword: 'matkhau123',
    });
    expect(hasErrors(errors)).toBe(false);
  });

  it('báo lỗi khi nhập lại mật khẩu không khớp', () => {
    const errors = validateRegister({
      username: 'an_01',
      password: 'matkhau123',
      confirmPassword: 'matkhau124',
    });
    expect(errors.confirmPassword).toBeDefined();
    expect(errors.username).toBeUndefined();
  });

  it('không báo lỗi nhập lại khi mật khẩu chính đã sai', () => {
    const errors = validateRegister({
      username: 'an_01',
      password: '123',
      confirmPassword: '123',
    });
    expect(errors.password).toBeDefined();
    expect(errors.confirmPassword).toBeUndefined();
  });
});

describe('toInternalEmail', () => {
  it('ghép tên đăng nhập thành email nội bộ viết thường', () => {
    expect(toInternalEmail(' An_01 ')).toBe('an_01@rulepath.app');
  });
});

describe('friendlyAuthError', () => {
  it('báo trùng tên khi đăng ký bị trùng', () => {
    expect(friendlyAuthError('User already registered', 'register')).toContain('đã có người dùng');
    expect(friendlyAuthError('duplicate key value violates unique constraint', 'register')).toContain(
      'đã có người dùng',
    );
  });

  it('báo sai thông tin khi đăng nhập thất bại', () => {
    expect(friendlyAuthError('Invalid login credentials', 'login')).toBe(
      'Tên đăng nhập hoặc mật khẩu không đúng.',
    );
  });
});
