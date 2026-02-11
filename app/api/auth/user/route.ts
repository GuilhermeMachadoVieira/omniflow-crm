import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/types";

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Simplesmente retorna null para usuário não autenticado
    // Evita qualquer acesso ao banco durante build
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
    
    if (!authCookie?.value) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    let user;
    try {
      user = JSON.parse(authCookie.value);
    } catch {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
