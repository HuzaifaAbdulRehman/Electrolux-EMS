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
    const customerId = searchParams.get('customerId') || searchParams.get('id');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const connectionType = searchParams.get('connectionType') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // If customerId is provided, fetch that specific customer
    if (customerId) {
      const customer = await db
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
        .from(customers)
        .where(eq(customers.id, parseInt(customerId)))
        .limit(1);

      return NextResponse.json({
        success: true,
        data: customer,
      });
    }

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
      .from(customers)
      .$dynamic();

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
      .from(customers)
      .$dynamic();

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

    console.log('[CREATE CUSTOMER] User created with ID:', newUser.id);

    // Generate account number (unique timestamp-based)
    // Format: ELX-YYYY-XXXXXX-RRR (Year-Timestamp-Random)
    const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
    const accountNumber = `ELX-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}-${randomSuffix}`;

    // Determine customer status
    // For 5th semester project: pending_installation means meter not yet assigned
    const customerStatus = body.status || (body.meterNumber ? 'active' : 'pending_installation');

    // Meter number will be assigned AFTER installation by employee
    // For now, only assign if explicitly provided (existing meter) or if status is active
    let meterNumber = null;
    if (body.meterNumber) {
      // Admin manually providing meter number (existing meter)
      meterNumber = body.meterNumber;
    } else if (customerStatus === 'active') {
      // For backward compatibility: auto-generate if marked as active
      // DBMS Project: Use AUTO_INCREMENT customer.id for uniqueness
      // We'll update after INSERT to use actual customer ID
      meterNumber = 'TEMP'; // Temporary, will be updated below
    }

    console.log('[CREATE CUSTOMER] Account number:', accountNumber);
    console.log('[CREATE CUSTOMER] Initial meter number:', meterNumber);
    console.log('[CREATE CUSTOMER] Status:', customerStatus);

    // Create customer record
    const [newCustomer] = await db.insert(customers).values({
      userId: newUser.id,
      accountNumber,
      meterNumber: meterNumber,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      zone: body.zone || null, // Load shedding zone
      connectionType: body.connectionType,
      status: customerStatus,
      connectionDate: body.connectionDate || new Date().toISOString().split('T')[0],
    } as any);

    const customerId = newCustomer.id;
    console.log('[CREATE CUSTOMER] Customer created with ID:', customerId);

    // If meter number was set to TEMP, update with actual customer ID
    if (meterNumber === 'TEMP') {
      // DBMS Project: Meter number format MTR-{CustomerID}-{Year}
      // This ensures uniqueness using AUTO_INCREMENT ID
      const actualMeterNumber = `MTR-${String(customerId).padStart(6, '0')}-${new Date().getFullYear()}`;

      await db.update(customers)
        .set({ meterNumber: actualMeterNumber } as any)
        .where(eq(customers.id, customerId));

      meterNumber = actualMeterNumber;
      console.log('[CREATE CUSTOMER] Meter number updated to:', actualMeterNumber);
    }

    return NextResponse.json({
      success: true,
      message: customerStatus === 'pending_installation'
        ? 'Customer created successfully. Meter number will be assigned after installation.'
        : 'Customer created successfully',
      data: {
        id: customerId,
        accountNumber,
        meterNumber,
        status: customerStatus,
        temporaryPassword: randomPassword, // Admin should provide this to customer
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