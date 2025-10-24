import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle/db';
import { users } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    // Validate input
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = userResults[0];

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.emailVerified === 1) {
      return NextResponse.json(
        { success: true, message: 'Email already verified! You can now login.' },
        { status: 200 }
      );
    }

    // Check if code matches
    if (user.verificationCode !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Check if code has expired
    if (user.verificationCodeExpiry && new Date() > new Date(user.verificationCodeExpiry)) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Update user as verified and clear verification code
    await db
      .update(users)
      .set({
        emailVerified: 1,
        verificationCode: null,
        verificationCodeExpiry: null,
      })
      .where(eq(users.email, email));

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now login.',
    }, { status: 200 });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
