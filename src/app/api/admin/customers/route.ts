import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, users } from '@/lib/drizzle/schema';
import { eq, sql, desc, and, like, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can access customer management
    if (session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    console.log('[Admin Customers API] Fetching customers with filters:', { search, status, page, limit });

    // Build where conditions (DBMS: Dynamic Query Building)
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(
        or(
          like(customers.fullName, `%${search}%`),
          like(customers.accountNumber, `%${search}%`),
          like(customers.meterNumber, `%${search}%`),
          like(customers.phone, `%${search}%`)
        )
      );
    }

    if (status !== 'all') {
      whereConditions.push(eq(customers.status, status));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get total count (DBMS: COUNT with WHERE)
    const [totalResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(customers)
      .where(whereClause);

    // Get customers with pagination (DBMS: JOIN with Users table)
    const customersData = await db
      .select({
        id: customers.id,
        accountNumber: customers.accountNumber,
        meterNumber: customers.meterNumber,
        fullName: customers.fullName,
        phone: customers.phone,
        address: customers.address,
        city: customers.city,
        state: customers.state,
        connectionType: customers.connectionType,
        status: customers.status,
        averageMonthlyUsage: customers.averageMonthlyUsage,
        createdAt: customers.createdAt,
        userEmail: users.email,
        userStatus: users.status
      })
      .from(customers)
      .innerJoin(users, eq(customers.userId, users.id))
      .where(whereClause)
      .orderBy(desc(customers.createdAt))
      .limit(limit)
      .offset(offset);

    // Get status counts (DBMS: GROUP BY with COUNT)
    const statusCounts = await db
      .select({
        status: customers.status,
        count: sql<number>`COUNT(*)`
      })
      .from(customers)
      .groupBy(customers.status);

    const total = totalResult.count;
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // Format status counts
    const statusStats = statusCounts.reduce((acc, item) => {
      acc[item.status] = item.count;
      return acc;
    }, {} as Record<string, number>);

    console.log('[Admin Customers API] Customers fetched successfully:', {
      total,
      returned: customersData.length,
      page,
      totalPages
    });

    return NextResponse.json({
      success: true,
      data: {
        customers: customersData,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev
        },
        statusStats
      },
      message: 'Customers fetched successfully'
    });

  } catch (error: any) {
    console.error('[Admin Customers API] Error fetching customers:', error);
    return NextResponse.json({
      error: 'Failed to fetch customers',
      details: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { fullName, email, phone, address, city, state, connectionType, meterNumber } = body;

    // Validation (DBMS: Data Integrity)
    if (!fullName || !email || !phone || !address || !connectionType || !meterNumber) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'All fields are required'
      }, { status: 400 });
    }

    console.log('[Admin Customers API] Creating new customer:', { fullName, email });

    // Check if user already exists (DBMS: UNIQUE constraint check)
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({
        error: 'User already exists',
        details: 'A user with this email already exists'
      }, { status: 409 });
    }

    // Check if meter number already exists (DBMS: UNIQUE constraint check)
    const existingMeter = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.meterNumber, meterNumber))
      .limit(1);

    if (existingMeter.length > 0) {
      return NextResponse.json({
        error: 'Meter number already exists',
        details: 'This meter number is already in use'
      }, { status: 409 });
    }

    // Generate account number (DBMS: Auto-increment with prefix)
    const [lastCustomer] = await db
      .select({ accountNumber: customers.accountNumber })
      .from(customers)
      .orderBy(desc(customers.id))
      .limit(1);

    const lastNumber = lastCustomer?.accountNumber 
      ? parseInt(lastCustomer.accountNumber.split('-')[2]) 
      : 0;
    const newAccountNumber = `ELX-2024-${String(lastNumber + 1).padStart(6, '0')}`;

    // Create user first (DBMS: Foreign Key constraint)
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: 'temp_password_123', // Should be hashed in production
        userType: 'customer',
        fullName,
        phone,
        status: 'active'
      })
      .returning({ id: users.id });

    // Create customer record (DBMS: Transaction with Foreign Key)
    const [newCustomer] = await db
      .insert(customers)
      .values({
        userId: newUser.id,
        accountNumber: newAccountNumber,
        meterNumber,
        address,
        city,
        state,
        connectionType,
        status: 'active',
        averageMonthlyUsage: '0.00'
      })
      .returning();

    console.log('[Admin Customers API] Customer created successfully:', newCustomer.id);

    return NextResponse.json({
      success: true,
      data: {
        customer: {
          ...newCustomer,
          userEmail: email,
          userStatus: 'active'
        }
      },
      message: 'Customer created successfully'
    });

  } catch (error: any) {
    console.error('[Admin Customers API] Error creating customer:', error);
    return NextResponse.json({
      error: 'Failed to create customer',
      details: error.message
    }, { status: 500 });
  }
}
