import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { tariffs, tariffSlabs } from '@/lib/drizzle/schema';
import { eq, and, sql, desc } from 'drizzle-orm';

// GET /api/tariffs/[id] - Get single tariff with slabs
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tariffId = parseInt(params.id);
    if (isNaN(tariffId)) {
      return NextResponse.json({ error: 'Invalid tariff ID' }, { status: 400 });
    }

    // Get tariff details
    const [tariff] = await db
      .select()
      .from(tariffs)
      .where(eq(tariffs.id, tariffId))
      .limit(1);

    if (!tariff) {
      return NextResponse.json({ error: 'Tariff not found' }, { status: 404 });
    }

    // Get tariff slabs (normalized data)
    const slabs = await db
      .select()
      .from(tariffSlabs)
      .where(eq(tariffSlabs.tariffId, tariffId))
      .orderBy(tariffSlabs.slabOrder);

    return NextResponse.json({
      success: true,
      data: {
        ...tariff,
        slabs
      }
    });

  } catch (error) {
    console.error('Error fetching tariff:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch tariff',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PATCH /api/tariffs/[id] - Update tariff (create new version)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tariffId = parseInt(params.id);
    if (isNaN(tariffId)) {
      return NextResponse.json({ error: 'Invalid tariff ID' }, { status: 400 });
    }

    const body = await request.json();
    const { 
      category, 
      fixedCharge, 
      effectiveDate, 
      validUntil,
      slabs,
      electricityDutyPercent,
      gstPercent,
      timeOfUsePeakRate,
      timeOfUseNormalRate,
      timeOfUseOffpeakRate
    } = body;

    // Validate required fields
    if (!category || !fixedCharge || !effectiveDate) {
      return NextResponse.json({ 
        error: 'Missing required fields: category, fixedCharge, effectiveDate' 
      }, { status: 400 });
    }

    // Check if tariff exists
    const [existingTariff] = await db
      .select()
      .from(tariffs)
      .where(eq(tariffs.id, tariffId))
      .limit(1);

    if (!existingTariff) {
      return NextResponse.json({ error: 'Tariff not found' }, { status: 404 });
    }

    // For DBMS project: Create new version instead of updating existing
    // This maintains audit trail and prevents breaking existing bills
    const newTariffData = {
      category,
      fixedCharge: parseFloat(fixedCharge),
      effectiveDate: new Date(effectiveDate),
      validUntil: validUntil ? new Date(validUntil) : null,
      electricityDutyPercent: parseFloat(electricityDutyPercent || '16.0'),
      gstPercent: parseFloat(gstPercent || '18.0'),
      timeOfUsePeakRate: timeOfUsePeakRate ? parseFloat(timeOfUsePeakRate) : null,
      timeOfUseNormalRate: timeOfUseNormalRate ? parseFloat(timeOfUseNormalRate) : null,
      timeOfUseOffpeakRate: timeOfUseOffpeakRate ? parseFloat(timeOfUseOffpeakRate) : null,
      // Denormalized slab data (for performance)
      slab1Start: slabs[0]?.startUnits || 0,
      slab1End: slabs[0]?.endUnits || 100,
      slab1Rate: slabs[0]?.ratePerUnit || 0.08,
      slab2Start: slabs[1]?.startUnits || 101,
      slab2End: slabs[1]?.endUnits || 200,
      slab2Rate: slabs[1]?.ratePerUnit || 0.10,
      slab3Start: slabs[2]?.startUnits || 201,
      slab3End: slabs[2]?.endUnits || 300,
      slab3Rate: slabs[2]?.ratePerUnit || 0.12,
      slab4Start: slabs[3]?.startUnits || 301,
      slab4End: slabs[3]?.endUnits || 500,
      slab4Rate: slabs[3]?.ratePerUnit || 0.15,
      slab5Start: slabs[4]?.startUnits || 501,
      slab5End: slabs[4]?.endUnits || 999999,
      slab5Rate: slabs[4]?.ratePerUnit || 0.20,
    };

    // Insert new tariff version
    const [newTariff] = await db.insert(tariffs).values(newTariffData as any);

    // Insert normalized slabs
    if (slabs && slabs.length > 0) {
      const slabData = slabs.map((slab: any, index: number) => ({
        tariffId: newTariff.insertId,
        slabOrder: index + 1,
        startUnits: parseInt(slab.startUnits),
        endUnits: parseInt(slab.endUnits),
        ratePerUnit: parseFloat(slab.ratePerUnit)
      }));

      await db.insert(tariffSlabs).values(slabData as any);
    }

    // Mark old tariff as expired (soft delete for audit trail)
    await db
      .update(tariffs)
      .set({ validUntil: new Date(effectiveDate) })
      .where(
        and(
          eq(tariffs.id, tariffId),
          sql`${tariffs.validUntil} IS NULL`
        )
      );

    return NextResponse.json({
      success: true,
      message: 'Tariff updated successfully (new version created)',
      data: {
        newTariffId: newTariff.insertId,
        oldTariffId: tariffId
      }
    });

  } catch (error) {
    console.error('Error updating tariff:', error);
    return NextResponse.json({ 
      error: 'Failed to update tariff',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/tariffs/[id] - Soft delete tariff
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tariffId = parseInt(params.id);
    if (isNaN(tariffId)) {
      return NextResponse.json({ error: 'Invalid tariff ID' }, { status: 400 });
    }

    // Check if tariff exists
    const [tariff] = await db
      .select()
      .from(tariffs)
      .where(eq(tariffs.id, tariffId))
      .limit(1);

    if (!tariff) {
      return NextResponse.json({ error: 'Tariff not found' }, { status: 404 });
    }

    // Check if tariff is currently active (has bills using it)
    const [activeBills] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(tariffs)
      .where(
        and(
          eq(tariffs.id, tariffId),
          sql`${tariffs.validUntil} IS NULL`
        )
      );

    if (activeBills.count > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete active tariff. Create a new version first.' 
      }, { status: 400 });
    }

    // Soft delete: Set validUntil to today
    await db
      .update(tariffs)
      .set({ validUntil: new Date() })
      .where(eq(tariffs.id, tariffId));

    return NextResponse.json({
      success: true,
      message: 'Tariff deleted successfully (soft delete)'
    });

  } catch (error) {
    console.error('Error deleting tariff:', error);
    return NextResponse.json({ 
      error: 'Failed to delete tariff',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
