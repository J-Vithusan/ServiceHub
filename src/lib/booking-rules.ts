export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export const ALLOWED_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [], // Terminal state
  CANCELLED: [], // Terminal state
};

/**
 * Validates whether a status transition is permitted according to ServiceHub lifecycle rules.
 */
export function isValidStatusTransition(
  currentStatus: BookingStatus,
  targetStatus: BookingStatus
): boolean {
  if (currentStatus === targetStatus) return true;
  const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
}

/**
 * Validates that a booking date is not in the past (must be today or future).
 */
export function isFutureOrToday(dateInput: string | Date): boolean {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  return target >= today;
}

/**
 * Determines whether a user has permission to cancel a booking.
 */
export function canUserCancelBooking(
  userRole: 'CUSTOMER' | 'ADMIN',
  bookingUserId: string,
  currentUserId: string,
  currentStatus: BookingStatus
): { allowed: boolean; reason?: string } {
  // Terminal states cannot be cancelled
  if (currentStatus === 'COMPLETED') {
    return { allowed: false, reason: 'Completed bookings cannot be cancelled.' };
  }
  if (currentStatus === 'CANCELLED') {
    return { allowed: false, reason: 'This booking is already cancelled.' };
  }

  // Admins can cancel any pending or confirmed booking
  if (userRole === 'ADMIN') {
    return { allowed: true };
  }

  // Customers can only cancel their own bookings
  if (bookingUserId !== currentUserId) {
    return { allowed: false, reason: 'You are not authorized to cancel this booking.' };
  }

  // Customers can cancel pending or confirmed bookings
  if (currentStatus === 'PENDING' || currentStatus === 'CONFIRMED') {
    return { allowed: true };
  }

  return { allowed: false, reason: `Cannot cancel a booking in ${currentStatus} status.` };
}
