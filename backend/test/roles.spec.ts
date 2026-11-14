import { describe, expect, it } from 'vitest';
import { APP_ROLES, MANAGER_ROLES, resolveAppRole } from '../src/auth/auth.types.js';

describe('resolveAppRole', () => {
  it('keeps the three supported app roles', () => {
    expect(resolveAppRole('admin')).toBe('admin');
    expect(resolveAppRole('starosta')).toBe('starosta');
    expect(resolveAppRole('student')).toBe('student');
  });

  it('maps legacy Clerk metadata values onto app roles', () => {
    expect(resolveAppRole('supervisor')).toBe('starosta');
    expect(resolveAppRole('user')).toBe('student');
  });

  it('falls back to the least privileged role for unknown metadata', () => {
    expect(resolveAppRole(undefined)).toBe('student');
    expect(resolveAppRole(null)).toBe('student');
    expect(resolveAppRole('')).toBe('student');
    expect(resolveAppRole(42)).toBe('student');
    expect(resolveAppRole('superadmin')).toBe('student');
  });

  it('exposes every role exactly once', () => {
    expect([...APP_ROLES].sort()).toEqual(['admin', 'starosta', 'student']);
  });

  it('lets only managers edit group data', () => {
    expect([...MANAGER_ROLES].sort()).toEqual(['admin', 'starosta']);
    expect(MANAGER_ROLES).not.toContain('student');
  });
});
