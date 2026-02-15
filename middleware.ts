import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { authRateLimit, registerRateLimit, getClientIdentifier, checkRateLimit } from "@/lib/rate-limit";

// Defina aqui todas as rotas que podem ser acessadas SEM login
const PUBLIC_PATHS = ["/login", "/register"];
const PUBLIC_PREFIXES = ["/api/health", "/api/auth/user", "/api/auth/", "/_next"]; // inclui NextAuth e assets estáticos

// Rotas que requerem permissões específicas
const PROTECTED_ROUTES = {
  "/settings/team": ["manage_team"],
  "/settings": ["manage_settings"],
} as const;

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const identifier = getClientIdentifier(request);

  // Ignorar preflight
  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }

  // Rate limiting para rotas de auth
  if (path === '/login' && request.method === 'POST') {
    const rateLimitResult = checkRateLimit(authRateLimit, identifier);
    if (!rateLimitResult.success) {
      return new NextResponse(
        JSON.stringify({ error: rateLimitResult.error }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...rateLimitResult.headers,
          },
        }
      );
    }
  }

  if (path === '/register' && request.method === 'POST') {
    const rateLimitResult = checkRateLimit(registerRateLimit, identifier);
    if (!rateLimitResult.success) {
      return new NextResponse(
        JSON.stringify({ error: rateLimitResult.error }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...rateLimitResult.headers,
          },
        }
      );
    }
  }
  
  // Verifica se a rota atual está na lista de públicas
  const isPublicPath = PUBLIC_PATHS.includes(path);
  const isPublicPrefix = PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix));

  if (isPublicPrefix) {
    return NextResponse.next();
  }

  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
  });
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

  // 3. Rate limiting
  // Middleware roda em Edge Runtime e não deve depender de estado em memória.
  // Mantemos headers informativos; para rate limit real, use Redis/Upstash ou aplique por rota/API.

  // 4. Verificar permissões específicas para rotas protegidas
  for (const [route, requiredPermissions] of Object.entries(PROTECTED_ROUTES)) {
    if (path.startsWith(route)) {
      // Aqui você poderia buscar o usuário no banco para verificar as permissões
      // Por enquanto, vamos apenas redirecionar se não tiver o token básico
      if (!token) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // 5. Adicionar headers de rate limit na resposta
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', '100');
  response.headers.set('X-RateLimit-Remaining', 'unknown');
  response.headers.set('X-RateLimit-By', identifier);

  return response;
}

export const config = {
  // O matcher ignora arquivos estáticos (_next, imagens, favicon)
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};