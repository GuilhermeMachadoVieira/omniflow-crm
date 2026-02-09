import { AUTH_COOKIE_NAME } from "@/lib/types";

/** Remove o cookie de auth no cliente (logout). */
export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

/** Verifica no cliente se o cookie de auth existe. */
export function hasAuthCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes(`${AUTH_COOKIE_NAME}=`);
}
