import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle/db';
import { users } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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
        { error: 'Email is already verified. You can login now.' },
        { status: 400 }
      );
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user with new code
    await db
      .update(users)
      .set({
        verificationCode: verificationCode,
        verificationCodeExpiry: verificationCodeExpiry,
      })
      .where(eq(users.email, email));

    return NextResponse.json({
      success: true,
      message: 'New verification code sent!',
      verificationCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined, // Only in dev mode
    }, { status: 200 });

  } catch (error) {
    console.error('Resend code error:', error);
    return NextResponse.json(
      { error: 'Failed to resend code. Please try again.' },
      { status: 500 }
    );
  }
}
