import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/session';
import { bookingStatusUpdateSchema } from '@/lib/validations';
import {
  BookingStatus,
  isValidStatusTransition,
  canUserCancelBooking,
} from '@/lib/booking-rules';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const sessionUser = await getSessionFromRequest(request);
    if (!sessionUser) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
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
            address: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found.' },
        { status: 404 }
      );
    }

    // Role authorization
    if (sessionUser.role !== 'ADMIN' && booking.userId !== sessionUser.id) {
      return NextResponse.json(
        { error: 'Unauthorized to view this booking.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving booking:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve booking.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const sessionUser = await getSessionFromRequest(request);
    if (!sessionUser) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const result = bookingStatusUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { status: targetStatus, cancellationReason } = result.data;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found.' },
        { status: 404 }
      );
    }

    const currentStatus = booking.status as BookingStatus;

    // CUSTOMER authorization check
    if (sessionUser.role !== 'ADMIN') {
      if (booking.userId !== sessionUser.id) {
        return NextResponse.json(
          { error: 'Unauthorized to modify this booking.' },
          { status: 403 }
        );
      }

      // Customers are ONLY permitted to cancel bookings
      if (targetStatus !== 'CANCELLED') {
        return NextResponse.json(
          { error: 'Customers are only permitted to cancel bookings.' },
          { status: 403 }
        );
      }

      const cancelCheck = canUserCancelBooking(
        'CUSTOMER',
        booking.userId,
        sessionUser.id,
        currentStatus
      );

      if (!cancelCheck.allowed) {
        return NextResponse.json(
          { error: cancelCheck.reason || 'Cannot cancel this booking.' },
          { status: 400 }
        );
      }
    } else {
      // ADMIN: Enforce legal status transitions
      if (!isValidStatusTransition(currentStatus, targetStatus as BookingStatus)) {
        return NextResponse.json(
          {
            error: `Illegal status transition from ${currentStatus} to ${targetStatus}.`,
          },
          { status: 400 }
        );
      }
    }

    // Perform the status update
    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: targetStatus,
        cancellationReason:
          targetStatus === 'CANCELLED'
            ? cancellationReason || 'Cancelled by ' + (sessionUser.role === 'ADMIN' ? 'Administrator' : 'Customer')
            : booking.cancellationReason,
      },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: `Booking status updated to ${targetStatus}`,
        booking: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error while updating booking.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const sessionUser = await getSessionFromRequest(request);
    if (!sessionUser) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found.' },
        { status: 404 }
      );
    }

    const cancelCheck = canUserCancelBooking(
      sessionUser.role,
      booking.userId,
      sessionUser.id,
      booking.status as BookingStatus
    );

    if (!cancelCheck.allowed) {
      return NextResponse.json(
        { error: cancelCheck.reason },
        { status: 400 }
      );
    }

    // Set status to CANCELLED
    const cancelled = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationReason:
          'Cancelled via cancellation request by ' +
          (sessionUser.role === 'ADMIN' ? 'Administrator' : 'Customer'),
      },
    });

    return NextResponse.json(
      {
        message: 'Booking cancelled successfully.',
        booking: cancelled,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Internal server error while cancelling booking.' },
      { status: 500 }
    );
  }
}
