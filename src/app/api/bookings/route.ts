import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/session';
import { bookingCreateSchema } from '@/lib/validations';
import { isFutureOrToday } from '@/lib/booking-rules';

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionFromRequest(request);
    if (!sessionUser) {
      return NextResponse.json(
        { error: 'Authentication required to view bookings.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const userId = searchParams.get('userId');

    const where: Record<string, unknown> = {};

    // Customers only see their own bookings; Admins see all or filter by customer
    if (sessionUser.role !== 'ADMIN') {
      where.userId = sessionUser.id;
    } else if (userId) {
      where.userId = userId;
    }

    // Status filter
    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Search filter (Admin search customer name/email, service name)
    if (search && search.trim()) {
      where.OR = [
        { service: { name: { contains: search.trim() } } },
        { user: { name: { contains: search.trim() } } },
        { user: { email: { contains: search.trim() } } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { bookingDate: 'desc' },
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve bookings.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionFromRequest(request);
    if (!sessionUser) {
      return NextResponse.json(
        { error: 'You must be logged in to make a booking.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = bookingCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { serviceId, bookingDate, timeSlot, notes } = result.data;

    // 1. Business Rule: No past dates
    if (!isFutureOrToday(bookingDate)) {
      return NextResponse.json(
        { error: 'Booking date cannot be in the past.' },
        { status: 400 }
      );
    }

    // 2. Verify service exists and is ACTIVE
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found.' },
        { status: 404 }
      );
    }

    if (service.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'This service is currently unavailable for new bookings.' },
        { status: 400 }
      );
    }

    const parsedDate = new Date(bookingDate);
    // Standardize to start of day in UTC/ISO
    parsedDate.setHours(0, 0, 0, 0);

    // 3. Business Rule: No double-booking for the same user
    const existingUserBooking = await prisma.booking.findFirst({
      where: {
        userId: sessionUser.id,
        serviceId,
        bookingDate: parsedDate,
        timeSlot,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (existingUserBooking) {
      return NextResponse.json(
        {
          error:
            'You already have an active booking for this service on this date and time slot.',
        },
        { status: 409 }
      );
    }

    // 4. Business Rule: Check if the exact time slot is already confirmed
    const slotConflict = await prisma.booking.findFirst({
      where: {
        serviceId,
        bookingDate: parsedDate,
        timeSlot,
        status: 'CONFIRMED',
      },
    });

    if (slotConflict) {
      return NextResponse.json(
        {
          error:
            'This time slot has already been booked. Please select another time.',
        },
        { status: 409 }
      );
    }

    // 5. Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: sessionUser.id,
        serviceId,
        bookingDate: parsedDate,
        timeSlot,
        notes: notes || null,
        totalPrice: service.price,
        status: 'PENDING',
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Booking successfully submitted! Awaiting confirmation.',
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing booking.' },
      { status: 500 }
    );
  }
}
