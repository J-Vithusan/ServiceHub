import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const sessionUser = await getSessionFromRequest(request);

  if (!sessionUser) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  // Fetch freshest user data from database
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user }, { status: 200 });
}
