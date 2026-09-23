import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionFromRequest(request);
    if (!sessionUser || sessionUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin privileges are required.' },
        { status: 403 }
      );
    }

    // Run parallel queries for maximum performance
    const [
      totalBookings,
      activeServicesCount,
      totalCustomersCount,
      pendingCount,
      confirmedCount,
      completedCount,
      cancelledCount,
      recentBookings,
      allCompletedBookings,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.service.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.booking.count({ where: { status: 'CANCELLED' } }),
      prisma.booking.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          service: {
            select: { name: true, price: true },
          },
          user: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.booking.findMany({
        where: {
          status: { in: ['CONFIRMED', 'COMPLETED'] },
        },
        select: {
          totalPrice: true,
          bookingDate: true,
        },
      }),
    ]);

    const totalRevenue = allCompletedBookings.reduce(
      (sum, b) => sum + (b.totalPrice || 0),
      0
    );

    return NextResponse.json(
      {
        metrics: {
          totalBookings,
          totalRevenue,
          activeServicesCount,
          totalCustomersCount,
          statusBreakdown: {
            PENDING: pendingCount,
            CONFIRMED: confirmedCount,
            COMPLETED: completedCount,
            CANCELLED: cancelledCount,
          },
        },
        recentBookings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to aggregate administrative statistics.' },
      { status: 500 }
    );
  }
}
