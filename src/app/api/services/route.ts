import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/session';
import { serviceCreateSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const categorySlug = searchParams.get('category') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const statusParam = searchParams.get('status');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';

    const sessionUser = await getSessionFromRequest(request);
    const isAdmin = sessionUser?.role === 'ADMIN';

    // Filters definition
    const where: Record<string, unknown> = {};

    // Only admins can view inactive services; public sees only ACTIVE
    if (isAdmin && statusParam) {
      if (statusParam !== 'ALL') {
        where.status = statusParam;
      }
    } else if (!isAdmin) {
      where.status = 'ACTIVE';
    }

    if (search.trim()) {
      where.OR = [
        { name: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    } else if (categorySlug && categorySlug !== 'all') {
      where.category = {
        slug: categorySlug,
      };
    }

    if (minPrice || maxPrice) {
      const priceFilter: { gte?: number; lte?: number } = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        priceFilter.gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        priceFilter.lte = Number(maxPrice);
      }
      where.price = priceFilter;
    }

    // Sorting
    let orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' };
    if (sort === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'name-asc') {
      orderBy = { name: 'asc' };
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
      },
      orderBy,
    });

    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve services.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionFromRequest(request);
    if (!sessionUser || sessionUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin privileges are required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = serviceCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, categoryId, description, price, durationMinutes, status, imageUrl } =
      result.data;

    // Verify category existence
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Selected category does not exist.' },
        { status: 400 }
      );
    }

    // Generate slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${baseSlug}-${randomSuffix}`;

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        categoryId,
        description,
        price,
        durationMinutes: durationMinutes || 60,
        status: status || 'ACTIVE',
        imageUrl: imageUrl || null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service.' },
      { status: 500 }
    );
  }
}
