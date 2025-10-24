import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { tariffs } from '@/lib/drizzle/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/tariffs - Get all tariffs
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await db
      .select()
      .from(tariffs)
      .orderBy(desc(tariffs.effectiveDate));

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching tariffs:', error);
    return NextResponse.json({ error: 'Failed to fetch tariffs' }, { status: 500 });
  }
}

// POST /api/tariffs - Create/Update tariff (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { category, fixedCharge, slabs, electricityDutyPercent, gstPercent } = body;

    if (!category || !fixedCharge || !slabs) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create new tariff
    const [newTariff] = await db.insert(tariffs).values({
      category,
      fixedCharge: fixedCharge.toString(),
      slab1Start: slabs[0].start,
      slab1End: slabs[0].end,
      slab1Rate: slabs[0].rate.toString(),
      slab2Start: slabs[1].start,
      slab2End: slabs[1].end,
      slab2Rate: slabs[1].rate.toString(),
      slab3Start: slabs[2].start,
      slab3End: slabs[2].end,
      slab3Rate: slabs[2].rate.toString(),
      slab4Start: slabs[3].start,
      slab4End: slabs[3].end,
      slab4Rate: slabs[3].rate.toString(),
      slab5Start: slabs[4].start,
      slab5End: slabs[4].end || null,
      slab5Rate: slabs[4].rate.toString(),
      electricityDutyPercent: electricityDutyPercent.toString(),
      gstPercent: gstPercent.toString(),
      effectiveDate: new Date().toISOString().split('T')[0],
    });

    return NextResponse.json({
      success: true,
      message: 'Tariff created successfully',
      data: {
        tariffId: newTariff.insertId,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating tariff:', error);
    return NextResponse.json({ error: 'Failed to create tariff' }, { status: 500 });
  }
}