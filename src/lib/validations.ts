import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100),
  email: z.string().email('Please provide a valid email address').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters long').max(100),
  role: z.enum(['CUSTOMER', 'ADMIN']).optional().default('CUSTOMER'),
  phone: z.string().max(30).optional().nullable(),
  address: z.string().max(255).optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const serviceCreateSchema = z.object({
  name: z.string().min(2, 'Service name must be at least 2 characters').max(120),
  categoryId: z.string().min(1, 'Please select a valid category'),
  description: z.string().min(10, 'Description must be at least 10 characters long').max(2000),
  price: z.coerce.number().positive('Price must be greater than zero'),
  durationMinutes: z.coerce.number().int().min(15, 'Duration must be at least 15 minutes').default(60),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')).nullable(),
});

export const serviceUpdateSchema = serviceCreateSchema.partial();

export const bookingCreateSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
  bookingDate: z.string().refine((val) => {
    const date = new Date(val);
    if (isNaN(date.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, {
    message: 'Booking date cannot be in the past',
  }),
  timeSlot: z.string().min(1, 'Please select a preferred time slot'),
  notes: z.string().max(500).optional().nullable(),
});

export const bookingStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'], {
    message: 'Invalid booking status',
  }),
  cancellationReason: z.string().max(500).optional().nullable(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().max(30).optional().nullable(),
  address: z.string().max(255).optional().nullable(),
  avatarUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')).nullable(),
});

export const categoryCreateSchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').max(80),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ServiceCreateInput = z.infer<typeof serviceCreateSchema>;
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>;
export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
export type BookingStatusUpdateInput = z.infer<typeof bookingStatusUpdateSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
