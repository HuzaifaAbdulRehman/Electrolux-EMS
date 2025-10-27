import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle/db';
import { users, customers } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { generateMeterNumber, isValidMeterNumber, isMeterNumberAvailable } from '@/lib/utils/meterNumberGenerator';

// Registration schema validation
const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(/^0\d{10}$/, 'Phone number must be 11 digits starting with 0 (e.g., 03001234567)'),
  address: z.string().min(10, 'Address must be at least 10 characters').optional(),
  city: z.string().min(2, 'City is required').optional(),
  state: z.string().min(2, 'State is required').optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional(),
  meterNumber: z.string().optional(), // Optional - will be auto-generated if not provided
  connectionType: z.enum(['Residential', 'Commercial', 'Industrial', 'Agricultural']).optional().default('Residential'),
  adminSecretKey: z.string().optional(), // Secret key for admin registration
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    console.log('[Registration API] Starting registration process...');
    
    const body = await request.json();
    console.log('[Registration API] Request body received:', { 
      email: body.email, 
      fullName: body.fullName,
      city: body.city,
      hasMeterNumber: !!body.meterNumber
    });

    // Validate request body
    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      console.log('[Registration API] Validation failed:', validationResult.error.flatten().fieldErrors);
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    console.log('[Registration API] Validation passed, processing registration...');

    // Check if user already exists
    console.log('[Registration API] Checking for existing user...');
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existingUser.length > 0) {
      console.log('[Registration API] User already exists:', data.email);
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Check if phone number is already in use
    console.log('[Registration API] Checking for existing phone...');
    const existingPhone = await db
      .select()
      .from(customers)
      .where(eq(customers.phone, data.phone))
      .limit(1);

    if (existingPhone.length > 0) {
      console.log('[Registration API] Phone already exists:', data.phone);
      return NextResponse.json(
        { error: 'Phone number is already registered' },
        { status: 409 }
      );
    }

    // Handle meter number logic (auto-assign or validate existing)
    console.log('[Registration API] Processing meter number...');
    let finalMeterNumber: string | null;
    let customerStatus: 'pending_installation' | 'active' | 'suspended' | 'inactive' = 'pending_installation';

    if (data.meterNumber && data.meterNumber.trim()) {
      console.log('[Registration API] User provided meter number:', data.meterNumber);
      // Existing customer flow - validate provided meter number
      if (!isValidMeterNumber(data.meterNumber)) {
        console.log('[Registration API] Invalid meter number format');
        return NextResponse.json(
          { error: 'Invalid meter number format. Must be MTR-XXX-XXXXXX (e.g., MTR-KHI-000001)' },
          { status: 400 }
        );
      }

      const isAvailable = await isMeterNumberAvailable(data.meterNumber);
      if (!isAvailable) {
        console.log('[Registration API] Meter number already in use');
        return NextResponse.json(
          { error: 'This meter number is already registered to another customer' },
          { status: 409 }
        );
      }

      finalMeterNumber = data.meterNumber;
      customerStatus = 'active'; // Existing meter = active connection
    } else {
      console.log('[Registration API] New registration - pending meter installation');
      // New customer flow - no meter yet, will be assigned during installation
      finalMeterNumber = null; // No meter number until installation
      customerStatus = 'pending_installation'; // Pending admin approval and installation
    }

    console.log('[Registration API] Final meter number:', finalMeterNumber);
    console.log('[Registration API] Customer status:', customerStatus);

    // Check if admin secret key provided and valid
    const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
    const isAdminRegistration = data.adminSecretKey && data.adminSecretKey === ADMIN_SECRET_KEY;

    if (data.adminSecretKey && !isAdminRegistration) {
      console.log('[Registration API] Invalid admin secret key provided');
      // Security: Don't reveal that key is wrong, just create as customer
      // This prevents attackers from knowing they have wrong key
    }

    console.log('[Registration API] Registration type:', isAdminRegistration ? 'ADMIN' : 'CUSTOMER');

    // Generate secure password hash
    console.log('[Registration API] Hashing password...');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Start transaction (if supported by your MySQL setup)
    let newUser: any = null;

    try {
      console.log('[Registration API] Creating user account...');
      // Create user account
      const [insertResult] = await db.insert(users).values({
        email: data.email,
        password: hashedPassword,
        userType: isAdminRegistration ? 'admin' : 'customer',
        name: data.fullName,
        phone: data.phone,
        isActive: 1,
      });

      // Get user ID from insert result
      const userId = insertResult.id;
      console.log('[Registration API] User created with ID:', userId);

      // Get the newly created user
      [newUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      console.log('[Registration API] User retrieved:', newUser?.email);

      // If admin registration, skip customer record creation
      if (isAdminRegistration) {
        console.log('[Registration API] Admin registration completed successfully');
        return NextResponse.json({
          success: true,
          message: 'Admin account created successfully! You can now login.',
          data: {
            email: data.email,
            fullName: data.fullName,
            userType: 'admin',
          },
        }, { status: 201 });
      }

      // Generate unique account number (not meter - use customer's meter)
      const timestamp = Date.now();
      const accountNumber = `ELX-${new Date().getFullYear()}-${String(timestamp).slice(-6)}`;

      // Assign zone based on city (simple zone assignment)
      const getZoneFromCity = (city: string): string => {
        const cityLower = city.toLowerCase();
        if (cityLower.includes('karachi')) return 'Zone A';
        if (cityLower.includes('lahore')) return 'Zone B';
        if (cityLower.includes('islamabad') || cityLower.includes('rawalpindi')) return 'Zone C';
        if (cityLower.includes('faisalabad') || cityLower.includes('multan')) return 'Zone D';
        return 'Zone A'; // Default zone
      };

      const assignedZone = getZoneFromCity((data.city || 'Unknown') as string);
      console.log('[Registration API] Assigned zone:', assignedZone, 'for city:', data.city);

      // Create customer record
      const customerData: any = {
        userId: newUser.id,
        accountNumber,
        meterNumber: finalMeterNumber, // Use auto-generated or validated meter number
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        zone: assignedZone, // Assign zone based on city
        connectionType: data.connectionType || 'Residential',
        status: customerStatus, // 'pending_installation' or 'active'
        connectionDate: new Date().toISOString().split('T')[0],
        lastBillAmount: '0.00',
        outstandingBalance: '0.00',
        averageMonthlyUsage: '0.00',
        paymentStatus: 'paid',
      };

      console.log('[Registration API] Creating customer record...');
      await db.insert(customers).values(customerData);

      // Create notification for admin about new registration
      if (customerStatus === 'pending_installation') {
        const { notifications } = await import('@/lib/drizzle/schema');

        // Get admin user
        const [adminUser] = await db
          .select()
          .from(users)
          .where(eq(users.userType, 'admin'))
          .limit(1);

        if (adminUser) {
          await db.insert(notifications).values({
            userId: adminUser.id,
            notificationType: 'system',
            title: 'New Registration Pending Approval',
            message: `New customer ${data.fullName} has registered and requires meter installation approval.`,
            priority: 'high',
            actionUrl: '/admin/pending-registrations',
            actionText: 'Review Registration',
            isRead: 0,
          } as any);
        }
      }
      console.log('[Registration API] Customer record created successfully');

      // Return success response with status information
      console.log('[Registration API] Registration completed successfully');
      return NextResponse.json({
        success: true,
        message: customerStatus === 'pending_installation'
          ? 'Registration submitted successfully! Your account is pending approval. You will receive an email once your meter is installed.'
          : 'Registration successful! You can now login with your email and password.',
        data: {
          email: data.email,
          accountNumber,
          meterNumber: finalMeterNumber,
          fullName: data.fullName,
          status: customerStatus,
          isNewCustomer: !data.meterNumber,
          zone: assignedZone,
        },
      }, { status: 201 });

    } catch (dbError) {
      // If customer creation fails, try to clean up the user record
      console.error('[Registration API] Database error during registration:', dbError);

      // Attempt to delete the user if it was created
      if (newUser?.id) {
        try {
          console.log('[Registration API] Cleaning up user record...');
          await db.delete(users).where(eq(users.id, newUser.id));
          console.log('[Registration API] User record cleaned up');
        } catch (cleanupError) {
          console.error('[Registration API] Failed to cleanup user after registration failure:', cleanupError);
        }
      }

      throw dbError;
    }

  } catch (error: any) {
    console.error('[Registration API] Registration error:', error);

    if (error instanceof z.ZodError) {
      console.log('[Registration API] Zod validation error:', error.errors);
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.log('[Registration API] Returning error response:', error?.message || 'Unknown error');
    return NextResponse.json(
      { error: 'Registration failed. Please try again later.', details: error?.message || 'Unknown error' },
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