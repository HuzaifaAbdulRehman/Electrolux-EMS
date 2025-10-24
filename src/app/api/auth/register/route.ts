import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle/db';
import { users, customers } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Registration schema validation
const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  meterNumber: z.string().regex(/^MTR-[A-Z]{3}-\d{6}$/, 'Meter number must be in format MTR-XXX-XXXXXX (e.g., MTR-KHI-000001)'),
  connectionType: z.enum(['Residential', 'Commercial', 'Industrial', 'Agricultural']).optional().default('Residential'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Check if phone number is already in use
    const existingPhone = await db
      .select()
      .from(customers)
      .where(eq(customers.phone, data.phone))
      .limit(1);

    if (existingPhone.length > 0) {
      return NextResponse.json(
        { error: 'Phone number is already registered' },
        { status: 409 }
      );
    }

    // Check if meter number is already assigned
    const existingMeter = await db
      .select()
      .from(customers)
      .where(eq(customers.meterNumber, data.meterNumber))
      .limit(1);

    if (existingMeter.length > 0) {
      return NextResponse.json(
        { error: 'Meter number is already assigned to another customer' },
        { status: 409 }
      );
    }

    // Generate secure password hash
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Start transaction (if supported by your MySQL setup)
    let newUser: any = null;

    try {
      // Create user account
      await db.insert(users).values({
        email: data.email,
        password: hashedPassword,
        userType: 'customer',
        name: data.fullName,
        phone: data.phone,
        isActive: 1,
      });

      // Get the newly created user ID
      [newUser] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);

      // Generate unique account number (not meter - use customer's meter)
      const timestamp = Date.now();
      const accountNumber = `ELX-${new Date().getFullYear()}-${String(timestamp).slice(-6)}`;

      // Create customer record
      const customerData: any = {
        userId: newUser.id,
        accountNumber,
        meterNumber: data.meterNumber, // Use customer's meter number from input
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        connectionType: data.connectionType || 'Residential',
        status: 'active',
        connectionDate: new Date().toISOString().split('T')[0],
        lastBillAmount: '0',
        outstandingBalance: '0',
        averageMonthlyUsage: '0',
        paymentStatus: 'paid',
      };

      await db.insert(customers).values(customerData);

      // Return success response (without sensitive data)
      return NextResponse.json({
        success: true,
        message: 'Registration successful! You can now login with your email and password.',
        data: {
          email: data.email,
          accountNumber,
          meterNumber: data.meterNumber, // Return customer's meter number
          fullName: data.fullName,
        },
      }, { status: 201 });

    } catch (dbError) {
      // If customer creation fails, try to clean up the user record
      console.error('Database error during registration:', dbError);

      // Attempt to delete the user if it was created
      if (newUser?.id) {
        try {
          await db.delete(users).where(eq(users.id, newUser.id));
        } catch (cleanupError) {
          console.error('Failed to cleanup user after registration failure:', cleanupError);
        }
      }

      throw dbError;
    }

  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if email is available
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return NextResponse.json({
      available: existingUser.length === 0,
      message: existingUser.length === 0
        ? 'Email is available'
        : 'Email is already registered',
    });

  } catch (error) {
    console.error('Email check error:', error);
    return NextResponse.json(
      { error: 'Failed to check email availability' },
      { status: 500 }
    );
  }
}