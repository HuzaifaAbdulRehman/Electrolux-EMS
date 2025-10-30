import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { outages } from '@/lib/drizzle/schema';
import { sql, inArray } from 'drizzle-orm';

// GET /api/zones
// Returns distinct zones from outages table
// Query params:
//   onlyActive=true -> restrict to zones with scheduled or ongoing outages
//
// SECURITY NOTE: This endpoint is intentionally PUBLIC to support the
// public connection application form (/apply-connection). Zone names are
// not considered sensitive information as they're geographical divisions.
// If rate limiting is needed, implement at the middleware level.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyActive = searchParams.get('onlyActive') === 'true';

    // No authentication required - this endpoint is public by design
    // Used by: /apply-connection (public), /admin/customers, /admin/connection-requests

    // Build optional status filter
    let statusFilter: string[] | null = null;
    if (onlyActive) {
      statusFilter = ['scheduled', 'ongoing'];
    }

    const rows = await db
      .select({ zone: outages.zone })
      .from(outages)
      .where(
        statusFilter
          ? inArray(outages.status as any, statusFilter as any)
          : undefined
      )
      .groupBy(outages.zone)
      .orderBy(sql`LOWER(${outages.zone})`);

    const zones = rows
      .map(r => r.zone)
      .filter(Boolean);

    return NextResponse.json({ success: true, data: zones });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch zones' }, { status: 500 });
  }
}



