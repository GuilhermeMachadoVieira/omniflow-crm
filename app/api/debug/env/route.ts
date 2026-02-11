import { NextResponse } from 'next/server';

export async function GET() {
  // Only allow this in development or with a special query param for security
  const isDev = process.env.NODE_ENV === 'development';
  
  if (!isDev) {
    return NextResponse.json({ error: 'Debug endpoint only available in development' }, { status: 403 });
  }

  return NextResponse.json({
    NEXTAUTH_SECRET_EXISTS: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_SECRET_LENGTH: process.env.NEXTAUTH_SECRET?.length || 0,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
    DIRECT_URL_EXISTS: !!process.env.DIRECT_URL,
  });
}
