import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { signSessionToken, verifySessionToken, SessionUser } from '@/lib/session';

describe('Auth & Cryptographic Security', () => {
  describe('Password Hashing (bcrypt)', () => {
    it('correctly hashes password and validates matching plaintext', async () => {
      const plaintext = 'SuperSecret123!';
      const hash = await hashPassword(plaintext);

      expect(hash).not.toBe(plaintext);
      expect(hash.startsWith('$2')).toBe(true);

      const isValid = await verifyPassword(plaintext, hash);
      expect(isValid).toBe(true);
    });

    it('rejects incorrect passwords against hash', async () => {
      const plaintext = 'SuperSecret123!';
      const hash = await hashPassword(plaintext);

      const isInvalid = await verifyPassword('WrongPassword!', hash);
      expect(isInvalid).toBe(false);
    });
  });

  describe('JWT Session Tokens (jose)', () => {
    const mockUser: SessionUser = {
      id: 'usr-12345',
      name: 'Alice Springs',
      email: 'alice@example.com',
      role: 'CUSTOMER',
      avatarUrl: 'https://example.com/alice.jpg',
    };

    it('signs and verifies a valid session payload', async () => {
      const token = await signSessionToken(mockUser);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);

      const payload = await verifySessionToken(token);
      expect(payload).not.toBeNull();
      expect(payload?.id).toBe(mockUser.id);
      expect(payload?.email).toBe(mockUser.email);
      expect(payload?.role).toBe('CUSTOMER');
    });

    it('rejects tampered tokens', async () => {
      const token = await signSessionToken(mockUser);
      const tampered = token.slice(0, -6) + 'abcdef';

      const payload = await verifySessionToken(tampered);
      expect(payload).toBeNull();
    });

    it('preserves ADMIN role claims securely', async () => {
      const adminUser: SessionUser = {
        id: 'adm-999',
        name: 'Chief Admin',
        email: 'admin@servicehub.com',
        role: 'ADMIN',
      };

      const token = await signSessionToken(adminUser);
      const verified = await verifySessionToken(token);

      expect(verified?.role).toBe('ADMIN');
    });
  });
});
