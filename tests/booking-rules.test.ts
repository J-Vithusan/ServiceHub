import { describe, it, expect } from 'vitest';
import {
  isValidStatusTransition,
  isFutureOrToday,
  canUserCancelBooking,
} from '@/lib/booking-rules';

describe('Booking Business Rules & State Machine', () => {
  describe('isValidStatusTransition', () => {
    it('permits transition from PENDING to CONFIRMED', () => {
      expect(isValidStatusTransition('PENDING', 'CONFIRMED')).toBe(true);
    });

    it('permits transition from PENDING to CANCELLED', () => {
      expect(isValidStatusTransition('PENDING', 'CANCELLED')).toBe(true);
    });

    it('permits transition from CONFIRMED to COMPLETED', () => {
      expect(isValidStatusTransition('CONFIRMED', 'COMPLETED')).toBe(true);
    });

    it('permits transition from CONFIRMED to CANCELLED', () => {
      expect(isValidStatusTransition('CONFIRMED', 'CANCELLED')).toBe(true);
    });

    it('forbids transition from COMPLETED to PENDING or CANCELLED (terminal state)', () => {
      expect(isValidStatusTransition('COMPLETED', 'PENDING')).toBe(false);
      expect(isValidStatusTransition('COMPLETED', 'CANCELLED')).toBe(false);
      expect(isValidStatusTransition('COMPLETED', 'CONFIRMED')).toBe(false);
    });

    it('forbids transition from CANCELLED to CONFIRMED or COMPLETED (terminal state)', () => {
      expect(isValidStatusTransition('CANCELLED', 'CONFIRMED')).toBe(false);
      expect(isValidStatusTransition('CANCELLED', 'COMPLETED')).toBe(false);
    });
  });

  describe('isFutureOrToday', () => {
    it('returns true for today', () => {
      expect(isFutureOrToday(new Date())).toBe(true);
    });

    it('returns true for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isFutureOrToday(tomorrow)).toBe(true);
    });

    it('returns false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isFutureOrToday(yesterday)).toBe(false);
    });
  });

  describe('canUserCancelBooking', () => {
    const customerId = 'user-customer-1';
    const otherUserId = 'user-customer-2';

    it('allows customer to cancel their own PENDING booking', () => {
      const check = canUserCancelBooking('CUSTOMER', customerId, customerId, 'PENDING');
      expect(check.allowed).toBe(true);
    });

    it('allows customer to cancel their own CONFIRMED booking', () => {
      const check = canUserCancelBooking('CUSTOMER', customerId, customerId, 'CONFIRMED');
      expect(check.allowed).toBe(true);
    });

    it('forbids customer from cancelling another user booking', () => {
      const check = canUserCancelBooking('CUSTOMER', customerId, otherUserId, 'PENDING');
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain('not authorized');
    });

    it('forbids customer from cancelling an already COMPLETED booking', () => {
      const check = canUserCancelBooking('CUSTOMER', customerId, customerId, 'COMPLETED');
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain('Completed');
    });

    it('allows administrator to cancel any PENDING or CONFIRMED booking regardless of ownership', () => {
      const check = canUserCancelBooking('ADMIN', customerId, 'admin-id', 'CONFIRMED');
      expect(check.allowed).toBe(true);
    });
  });
});
