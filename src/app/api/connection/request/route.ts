import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { connectionApplications, customers, notifications } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';

// POST /api/connection/request - Submit new connection application
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      applicantName,
      fatherName,
      email,
      phone,
      alternatePhone,
      idType,
      idNumber,
      propertyType,
      connectionType,
      loadRequired,
      propertyAddress,
      city,
      state,
      pincode,
      landmark,
      preferredDate,
      purposeOfConnection,
      existingConnection,
      existingAccountNumber,
    } = body;

    // Validate required fields
    if (!applicantName || !email || !phone || !idType || !idNumber) {
      return NextResponse.json({ error: 'Personal information incomplete' }, { status: 400 });
    }

    if (!propertyType || !connectionType || !propertyAddress || !city) {
      return NextResponse.json({ error: 'Property details incomplete' }, { status: 400 });
    }

    if (!preferredDate || !purposeOfConnection) {
      return NextResponse.json({ error: 'Connection details incomplete' }, { status: 400 });
    }

    // Generate application number (format: APP-2025-XXXXXX)
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900000) + 100000; // 6-digit random number
    const applicationNumber = `APP-${year}-${randomNum}`;

    // Calculate load required if not provided
    let calculatedLoad = loadRequired;
    if (!calculatedLoad) {
      // Default load based on connection type
      switch (connectionType) {
        case 'single-phase':
          calculatedLoad = 5; // 5 KW
          break;
        case 'three-phase':
          calculatedLoad = 20; // 20 KW
          break;
        case 'industrial':
          calculatedLoad = 100; // 100 KW
          break;
        default:
          calculatedLoad = 5;
      }
    }

    // Calculate estimated charges based on connection type
    let estimatedCharges;
    switch (connectionType) {
      case 'single-phase':
        estimatedCharges = 150;
        break;
      case 'three-phase':
        estimatedCharges = 350;
        break;
      case 'industrial':
        estimatedCharges = null; // Custom quote needed
        break;
      default:
        estimatedCharges = 150;
    }

    // Estimated processing days
    const estimatedDays = connectionType === 'industrial' ? 30 : 14;

    // Insert connection application
    const [result] = await db.insert(connectionApplications).values({
      applicationNumber,
      customerId: session.user.customerId || null,
      applicantName,
      fatherName: fatherName || null,
      email,
      phone,
      alternatePhone: alternatePhone || null,
      idType,
      idNumber,
      propertyType,
      connectionType,
      loadRequired: calculatedLoad,
      propertyAddress,
      city,
      state: state || '',
      pincode: pincode || '',
      landmark: landmark || null,
      preferredConnectionDate: preferredDate,
      purposeOfConnection,
      existingConnection: existingConnection ? 1 : 0,
      existingAccountNumber: existingAccountNumber || null,
      status: 'pending',
      estimatedCharges,
      applicationFeePaid: 0, // Will be updated after payment
      estimatedConnectionDays: estimatedDays,
    } as any);

    // Create notification for user
    if (session.user.userId) {
      await db.insert(notifications).values({
        userId: session.user.userId,
        notificationType: 'connection',
        title: 'Connection Application Submitted',
        message: `Your connection application ${applicationNumber} has been received. Our team will contact you within 24-48 hours.`,
        priority: 'normal',
        actionUrl: '/customer/new-connection',
        actionText: 'View Application',
        isRead: 0,
      } as any);
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Connection application submitted successfully',
      applicationNumber,
      estimatedCharges: estimatedCharges ? `$${estimatedCharges}` : 'Custom Quote',
      estimatedDays,
      nextSteps: [
        'Application review and verification (1-2 business days)',
        'Site inspection scheduled by our technical team',
        `Application fee payment of $25 (${estimatedCharges ? `Total: $${estimatedCharges + 25}` : 'plus connection charges'})`,
        'Connection installation after approval',
        'Meter installation and connection activation',
      ],
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting connection application:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
