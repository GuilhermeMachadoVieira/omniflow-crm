/** Nome do cookie usado para simular autenticação (fake auth). */
export const AUTH_COOKIE_NAME = "omniflow-auth";

export const AUTH_COOKIE_VALUE = "true";

/** Define o cookie de auth no cliente (após login fake). */
export function setAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}; path=/; max-age=31536000; SameSite=Lax`;
}

/** Remove o cookie de auth no cliente (logout). */
export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

/** Verifica no cliente se o cookie de auth existe. */
export function hasAuthCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes(`${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}`);
}
