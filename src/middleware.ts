import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Role-based access control
    if (path.startsWith('/admin') && token?.userType !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (path.startsWith('/employee') && token?.userType !== 'employee') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (path.startsWith('/customer') && token?.userType !== 'customer') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Protect these routes
export const config = {
  matcher: [
    '/admin/:path*',
    '/employee/:path*',
    '/customer/:path*',
    '/api/admin/:path*',
    '/api/employee/:path*',
    '/api/customer/:path*',
  ],
};