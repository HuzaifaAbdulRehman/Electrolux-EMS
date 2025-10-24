import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      // Personal Information
      applicantName,
      fatherName,
      email,
      phone,
      alternatePhone,
      idType,
      idNumber,
      // Property Details
      propertyType,
      connectionType,
      loadRequired,
      propertyAddress,
      city,
      state,
      pincode,
      landmark,
      // Connection Details
      preferredDate,
      purposeOfConnection,
      existingConnection,
      existingAccountNumber,
    } = body;

    // Validate required fields
    if (!applicantName || !email || !phone || !idType || !idNumber) {
      return NextResponse.json(
        { error: 'Personal information is incomplete. Please fill all required fields.' },
        { status: 400 }
      );
    }

    if (!propertyType || !connectionType || !propertyAddress || !city) {
      return NextResponse.json(
        { error: 'Property details are incomplete. Please fill all required fields.' },
        { status: 400 }
      );
    }

    if (!preferredDate || !purposeOfConnection) {
      return NextResponse.json(
        { error: 'Connection details are incomplete. Please fill all required fields.' },
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

    // Validate phone format (basic validation)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Check if user already has a pending connection request with same email
    const existingRequests = await query(
      `SELECT id, application_number, status
       FROM connection_requests
       WHERE email = ? AND status IN ('pending', 'under_review')
       LIMIT 1`,
      [email]
    );

    if (Array.isArray(existingRequests) && existingRequests.length > 0) {
      return NextResponse.json(
        {
          error: 'You already have a pending connection request',
          applicationNumber: (existingRequests[0] as any).application_number,
          status: (existingRequests[0] as any).status
        },
        { status: 400 }
      );
    }

    // Generate unique application number
    const applicationNumber = `CONN-${new Date().getFullYear()}-${String(Date.now()).slice(-8)}`;

    // Calculate estimated connection charges based on type
    let estimatedCharges = 0;
    let estimatedDays = 15;

    switch (connectionType) {
      case 'single-phase':
        estimatedCharges = 150;
        estimatedDays = 10;
        break;
      case 'three-phase':
        estimatedCharges = 350;
        estimatedDays = 15;
        break;
      case 'industrial':
        estimatedCharges = 0; // Custom quote needed
        estimatedDays = 30;
        break;
      default:
        estimatedCharges = 150;
    }

    // Insert connection request into database
    const result = await query(
      `INSERT INTO connection_requests (
        application_number,
        applicant_name,
        father_name,
        email,
        phone,
        alternate_phone,
        id_type,
        id_number,
        property_type,
        connection_type,
        load_required,
        property_address,
        city,
        state,
        pincode,
        landmark,
        preferred_date,
        purpose_of_connection,
        existing_connection,
        existing_account_number,
        status,
        estimated_charges,
        application_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, CURDATE())`,
      [
        applicationNumber,
        applicantName,
        fatherName || null,
        email,
        phone,
        alternatePhone || null,
        idType,
        idNumber,
        propertyType,
        connectionType,
        loadRequired || null,
        propertyAddress,
        city,
        state || null,
        pincode || null,
        landmark || null,
        preferredDate,
        purposeOfConnection,
        existingConnection ? 1 : 0,
        existingAccountNumber || null,
        estimatedCharges
      ]
    );

    // Send confirmation email (implement email service later)
    // await sendConnectionRequestEmail(email, applicationNumber);

    return NextResponse.json({
      success: true,
      message: 'Connection request submitted successfully!',
      applicationNumber: applicationNumber,
      estimatedCharges: estimatedCharges > 0 ? `$${estimatedCharges}` : 'Custom Quote',
      estimatedDays: estimatedDays,
      nextSteps: [
        'Your application has been received and is under review',
        'Our team will conduct a site inspection within 3-5 business days',
        'You will receive a confirmation email with inspection details',
        `Connection will be established within ${estimatedDays} days after approval`
      ]
    });

  } catch (error: any) {
    console.error('Connection request error:', error);

    // Handle specific error cases
    if (error.message?.includes('Duplicate entry')) {
      return NextResponse.json(
        { error: 'A connection request with this information already exists' },
        { status: 400 }
      );
    }

    if (error.code === 'ER_NO_SUCH_TABLE') {
      return NextResponse.json(
        { error: 'Database table not found. Please contact system administrator.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit connection request. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch connection request status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationNumber = searchParams.get('applicationNumber');
    const email = searchParams.get('email');

    if (!applicationNumber && !email) {
      return NextResponse.json(
        { error: 'Application number or email is required' },
        { status: 400 }
      );
    }

    let queryStr = `
      SELECT
        id, application_number, applicant_name, email, phone,
        property_type, connection_type, property_address, city,
        status, estimated_charges, application_date,
        inspection_date, approval_date, installation_date,
        created_at, updated_at
      FROM connection_requests
      WHERE `;

    const params = [];

    if (applicationNumber) {
      queryStr += 'application_number = ?';
      params.push(applicationNumber);
    } else {
      queryStr += 'email = ? ORDER BY created_at DESC LIMIT 10';
      params.push(email);
    }

    const requests = await query(queryStr, params);

    if (!Array.isArray(requests) || requests.length === 0) {
      return NextResponse.json(
        { error: 'No connection request found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      requests: requests
    });

  } catch (error: any) {
    console.error('Fetch connection request error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch connection request details' },
      { status: 500 }
    );
  }
}
