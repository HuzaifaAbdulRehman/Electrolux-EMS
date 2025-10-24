import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { customers, users } from '@/lib/drizzle/schema';
import { eq, like, or, desc, asc, and, sql } from 'drizzle-orm';

// GET /api/customers - Get all customers (Admin/Employee only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin and employees can view all customers
    if (session.user.userType !== 'admin' && session.user.userType !== 'employee') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get query parameters for filtering and pagination
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const connectionType = searchParams.get('connectionType') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build query
    let query = db
      .select({
        id: customers.id,
        accountNumber: customers.accountNumber,
        meterNumber: customers.meterNumber,
        fullName: customers.fullName,
        email: customers.email,
        phone: customers.phone,
        address: customers.address,
        city: customers.city,
        state: customers.state,
        pincode: customers.pincode,
        connectionType: customers.connectionType,
        status: customers.status,
        connectionDate: customers.connectionDate,
        lastBillAmount: customers.lastBillAmount,
        lastPaymentDate: customers.lastPaymentDate,
        averageMonthlyUsage: customers.averageMonthlyUsage,
        outstandingBalance: customers.outstandingBalance,
        paymentStatus: customers.paymentStatus,
        createdAt: customers.createdAt,
        updatedAt: customers.updatedAt,
      })
      .from(customers);

    // Apply filters
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(customers.fullName, `%${search}%`),
          like(customers.email, `%${search}%`),
          like(customers.accountNumber, `%${search}%`),
          like(customers.meterNumber, `%${search}%`),
          like(customers.phone, `%${search}%`)
        )
      );
    }

    if (status) {
      conditions.push(eq(customers.status, status as any));
    }

    if (connectionType) {
      conditions.push(eq(customers.connectionType, connectionType as any));
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions) as any);
    }

    // Apply sorting
    const orderByColumn = {
      'createdAt': customers.createdAt,
      'fullName': customers.fullName,
      'accountNumber': customers.accountNumber,
      'connectionType': customers.connectionType,
      'status': customers.status,
      'outstandingBalance': customers.outstandingBalance,
    }[sortBy] || customers.createdAt;

    query = query.orderBy(
      sortOrder === 'asc' ? asc(orderByColumn) : desc(orderByColumn)
    );

    // Apply pagination
    query = query.limit(limit).offset(offset);

    const result = await query;

    // Get total count for pagination
    let countQuery = db
      .select({ count: sql`count(*)` })
      .from(customers);

    if (conditions.length > 0) {
      countQuery = countQuery.where(conditions.length === 1 ? conditions[0] : and(...conditions) as any);
    }

    const [{ count }] = await countQuery as any;

    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create new customer (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can create customers
    if (session.user.userType !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Validate required fields
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode', 'connectionType'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Generate a cryptographically secure password
    const crypto = await import('crypto');
    const randomPassword = crypto.randomBytes(8).toString('base64').replace(/[/+=]/g, '') +
                          crypto.randomBytes(4).toString('hex').toUpperCase() + '!@#';
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    const [newUser] = await db.insert(users).values({
      email: body.email,
      password: hashedPassword,
      userType: 'customer',
      name: body.fullName,
      phone: body.phone,
      isActive: 1,
    });

    // Generate account and meter numbers
    const accountNumber = `ELX-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const meterNumber = `MTR-${String(Date.now()).slice(-6)}`;

    // Create customer record
    const [newCustomer] = await db.insert(customers).values({
      userId: newUser.insertId,
      accountNumber,
      meterNumber,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      connectionType: body.connectionType,
      status: body.status || 'active',
      connectionDate: body.connectionDate || new Date().toISOString().split('T')[0],
    });

    return NextResponse.json({
      success: true,
      message: 'Customer created successfully',
      data: {
        id: newCustomer.insertId,
        accountNumber,
        meterNumber,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}