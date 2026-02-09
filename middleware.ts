import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/types";

// Defina aqui todas as rotas que podem ser acessadas SEM login
const PUBLIC_PATHS = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Verifica se a rota atual está na lista de públicas
  const isPublicPath = PUBLIC_PATHS.includes(path);
  
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  
  // Verifica se o cookie contém dados JSON (novo formato) ou valor antigo
  let isAuthenticated = false;
  
  if (authCookie?.value) {
    // Se tiver valor, assumimos que está autenticado (seja JSON ou string simples)
    isAuthenticated = true; 
    // Nota: A validação profunda do token/sessão geralmente ocorre no Server Action ou Page,
    // o middleware faz apenas a verificação de existência para roteamento rápido.
  }

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