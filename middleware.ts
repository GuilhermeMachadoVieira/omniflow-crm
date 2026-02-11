import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Defina aqui todas as rotas que podem ser acessadas SEM login
const PUBLIC_PATHS = ["/login", "/register"];
const PUBLIC_PREFIXES = ["/api/health", "/api/auth/user", "/api/auth/"]; // inclui NextAuth

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Ignorar preflight
  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }
  
  // Verifica se a rota atual está na lista de públicas
  const isPublicPath = PUBLIC_PATHS.includes(path);
  const isPublicPrefix = PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix));
  if (isPublicPrefix) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = Boolean(token);

  // 1. Se o usuário JÁ ESTÁ logado e tenta acessar Login ou Registro,
  // manda ele direto para o Dashboard (não faz sentido ele se cadastrar de novo)
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Se o usuário NÃO ESTÁ logado e tenta acessar uma rota privada (que NÃO é pública),
  // manda ele para o Login
  if (!isPublicPath && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    // (Opcional) Você pode adicionar ?callbackUrl=... aqui se quiser redirecionar de volta depois
    return NextResponse.redirect(loginUrl);
  }

  // 3. Caso contrário (Usuário não logado em rota pública OU Usuário logado em rota privada),
  // deixa passar.
  return NextResponse.next();
}

export const config = {
  // O matcher ignora arquivos estáticos (_next, imagens, favicon)
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};