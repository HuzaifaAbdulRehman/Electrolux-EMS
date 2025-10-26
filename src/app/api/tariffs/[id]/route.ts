import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { tariffs } from '@/lib/drizzle/schema';
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

    // Transform denormalized data to array format for frontend
    const transformedTariff = {
      id: tariff.id,
      category: tariff.category,
      fixedCharge: parseFloat(tariff.fixedCharge || '0'),
      validFrom: tariff.effectiveDate,
      validUntil: tariff.validUntil,
      slabs: [
        { range: `${tariff.slab1Start}-${tariff.slab1End} kWh`, rate: parseFloat(tariff.slab1Rate || '0'), startUnits: tariff.slab1Start, endUnits: tariff.slab1End, ratePerUnit: parseFloat(tariff.slab1Rate || '0') },
        { range: `${tariff.slab2Start}-${tariff.slab2End} kWh`, rate: parseFloat(tariff.slab2Rate || '0'), startUnits: tariff.slab2Start, endUnits: tariff.slab2End, ratePerUnit: parseFloat(tariff.slab2Rate || '0') },
        { range: `${tariff.slab3Start}-${tariff.slab3End} kWh`, rate: parseFloat(tariff.slab3Rate || '0'), startUnits: tariff.slab3Start, endUnits: tariff.slab3End, ratePerUnit: parseFloat(tariff.slab3Rate || '0') },
        { range: `${tariff.slab4Start}-${tariff.slab4End} kWh`, rate: parseFloat(tariff.slab4Rate || '0'), startUnits: tariff.slab4Start, endUnits: tariff.slab4End, ratePerUnit: parseFloat(tariff.slab4Rate || '0') },
        { range: `${tariff.slab5Start}+ kWh`, rate: parseFloat(tariff.slab5Rate || '0'), startUnits: tariff.slab5Start, endUnits: tariff.slab5End || 999999, ratePerUnit: parseFloat(tariff.slab5Rate || '0') },
      ],
      timeOfUse: {
        peak: { hours: '6 PM - 10 PM', rate: parseFloat(tariff.timeOfUsePeakRate || '0') },
        normal: { hours: '10 AM - 6 PM', rate: parseFloat(tariff.timeOfUseNormalRate || '0') },
        offPeak: { hours: '10 PM - 10 AM', rate: parseFloat(tariff.timeOfUseOffpeakRate || '0') }
      },
      electricityDutyPercent: parseFloat(tariff.electricityDutyPercent || '0'),
      gstPercent: parseFloat(tariff.gstPercent || '0'),
    };

    return NextResponse.json({
      success: true,
      data: transformedTariff
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
    console.log('[TARIFF UPDATE] Received request body:', JSON.stringify(body, null, 2));
    
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

    // Validate slabs array
    console.log('[TARIFF UPDATE] Validating slabs:', slabs);
    if (!slabs || !Array.isArray(slabs) || slabs.length < 5) {
      console.log('[TARIFF UPDATE] Slabs validation failed:', { slabs, isArray: Array.isArray(slabs), length: slabs?.length });
      return NextResponse.json({ 
        error: 'Invalid slabs data: must be an array with 5 slab objects' 
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

    // Format date to MySQL DATE format (YYYY-MM-DD)
    const formattedEffectiveDate = new Date(effectiveDate).toISOString().split('T')[0];

    const newTariffData = {
      // DO NOT include 'id' - it's AUTO_INCREMENT!
      category,
      fixedCharge: fixedCharge.toString(),
      effectiveDate: formattedEffectiveDate, // MySQL DATE format
      validUntil: validUntil ? new Date(validUntil).toISOString().split('T')[0] : null,
      electricityDutyPercent: (electricityDutyPercent || 16.0).toString(),
      gstPercent: (gstPercent || 18.0).toString(),
      timeOfUsePeakRate: timeOfUsePeakRate ? timeOfUsePeakRate.toString() : '0.00',
      timeOfUseNormalRate: timeOfUseNormalRate ? timeOfUseNormalRate.toString() : '0.00',
      timeOfUseOffpeakRate: timeOfUseOffpeakRate ? timeOfUseOffpeakRate.toString() : '0.00',
      // Denormalized slab data (for performance)
      slab1Start: slabs[0]?.startUnits || 0,
      slab1End: slabs[0]?.endUnits || 100,
      slab1Rate: (slabs[0]?.ratePerUnit || 0).toString(),
      slab2Start: slabs[1]?.startUnits || 101,
      slab2End: slabs[1]?.endUnits || 200,
      slab2Rate: (slabs[1]?.ratePerUnit || 0).toString(),
      slab3Start: slabs[2]?.startUnits || 201,
      slab3End: slabs[2]?.endUnits || 300,
      slab3Rate: (slabs[2]?.ratePerUnit || 0).toString(),
      slab4Start: slabs[3]?.startUnits || 301,
      slab4End: slabs[3]?.endUnits || 500,
      slab4Rate: (slabs[3]?.ratePerUnit || 0).toString(),
      slab5Start: slabs[4]?.startUnits || 501,
      slab5End: slabs[4]?.endUnits || null,
      slab5Rate: (slabs[4]?.ratePerUnit || 0).toString(),
    };

    console.log('[TARIFF UPDATE] Creating new tariff version:', JSON.stringify(newTariffData, null, 2));

    // Insert new tariff version
    try {
      const insertResult = await db.insert(tariffs).values(newTariffData as any);
      console.log('[TARIFF UPDATE] Insert result:', insertResult);
    } catch (insertError) {
      console.error('[TARIFF UPDATE] INSERT ERROR:', insertError);
      throw insertError;
    }

    console.log('[TARIFF UPDATE] New tariff created successfully');

    // Mark old tariff as expired (soft delete for audit trail)
    await db
      .update(tariffs)
      .set({ validUntil: formattedEffectiveDate }) // Use formatted date
      .where(
        and(
          eq(tariffs.id, tariffId),
          sql`${tariffs.validUntil} IS NULL`
        )
      );

    console.log('[TARIFF UPDATE] Old tariff marked as expired');

    // Get the newly created tariff
    const [newTariff] = await db
      .select()
      .from(tariffs)
      .where(
        and(
          eq(tariffs.category, category),
          sql`${tariffs.validUntil} IS NULL`
        )
      )
      .orderBy(desc(tariffs.id))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: 'Tariff updated successfully (new version created)',
      data: {
        newTariffId: newTariff?.id || null,
        oldTariffId: tariffId
      }
    });

  } catch (error) {
    console.error('[TARIFF UPDATE] Error updating tariff:', error);
    console.error('[TARIFF UPDATE] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
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
