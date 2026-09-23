import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  serviceCreateSchema,
  bookingCreateSchema,
  bookingStatusUpdateSchema,
} from '@/lib/validations';

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('accepts valid customer registration data', () => {
      const valid = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        phone: '+1 555-0199',
        address: '123 Market St',
      };
      const result = registerSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects passwords shorter than 6 characters', () => {
      const invalid = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password).toBeDefined();
      }
    });

    it('rejects malformed email addresses', () => {
      const invalid = {
        name: 'John Doe',
        email: 'not-an-email',
        password: 'Password123!',
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined();
      }
    });
  });

  describe('loginSchema', () => {
    it('accepts valid credentials format', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'anyPassword',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('serviceCreateSchema', () => {
    it('validates a complete service creation payload', () => {
      const valid = {
        name: 'Plumbing Diagnostic',
        categoryId: 'cat-123',
        description: 'Comprehensive inspection of residential plumbing fixtures and supply lines.',
        price: 99.99,
        durationMinutes: 60,
        status: 'ACTIVE',
      };
      const result = serviceCreateSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects negative or zero price', () => {
      const invalid = {
        name: 'Plumbing Diagnostic',
        categoryId: 'cat-123',
        description: 'Comprehensive inspection of residential plumbing fixtures and supply lines.',
        price: -10,
        durationMinutes: 60,
      };
      const result = serviceCreateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects descriptions shorter than 10 characters', () => {
      const invalid = {
        name: 'Service',
        categoryId: 'cat-123',
        description: 'Short',
        price: 50,
      };
      const result = serviceCreateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('bookingCreateSchema', () => {
    it('accepts future dates and valid slots', () => {
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const result = bookingCreateSchema.safeParse({
        serviceId: 'svc-1',
        bookingDate: tomorrow,
        timeSlot: '10:00 AM',
        notes: 'Ring bell',
      });
      expect(result.success).toBe(true);
    });

    it('rejects past booking dates', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const result = bookingCreateSchema.safeParse({
        serviceId: 'svc-1',
        bookingDate: yesterday,
        timeSlot: '10:00 AM',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('bookingStatusUpdateSchema', () => {
    it('accepts permitted enum statuses', () => {
      expect(bookingStatusUpdateSchema.safeParse({ status: 'CONFIRMED' }).success).toBe(true);
      expect(bookingStatusUpdateSchema.safeParse({ status: 'COMPLETED' }).success).toBe(true);
      expect(bookingStatusUpdateSchema.safeParse({ status: 'CANCELLED' }).success).toBe(true);
    });

    it('rejects invalid status strings', () => {
      expect(bookingStatusUpdateSchema.safeParse({ status: 'IN_PROGRESS' }).success).toBe(false);
      expect(bookingStatusUpdateSchema.safeParse({ status: 'UNKNOWN' }).success).toBe(false);
    });
  });
});
