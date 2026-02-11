import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      timestamp: new Date().toISOString(),
      environment: {
        NEXTAUTH_SECRET_EXISTS: !!process.env.NEXTAUTH_SECRET,
        AUTH_SECRET_EXISTS: !!process.env.AUTH_SECRET,
        NEXTAUTH_SECRET_LENGTH: process.env.NEXTAUTH_SECRET?.length || 0,
        AUTH_SECRET_LENGTH: process.env.AUTH_SECRET?.length || 0,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
        DIRECT_URL_EXISTS: !!process.env.DIRECT_URL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        VERCEL_URL: process.env.VERCEL_URL,
      }
    },
    { status: 200 }
  );
}
