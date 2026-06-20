import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "kyanh_admin_session";
const SESSION_VALUE = "authenticated";

/** Sign a simple session token using the secret */
function makeToken(): string {
  const secret = process.env.ADMIN_SECRET ?? "default-secret";
  // Simple HMAC-like concat (for demo; swap for jose/jsonwebtoken in production)
  const payload = `${SESSION_VALUE}:${secret}`;
  return Buffer.from(payload).toString("base64url");
}

function verifyToken(token: string): boolean {
  return token === makeToken();
}

/** Set the admin session cookie (server action / route handler) */
export async function setAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

/** Clear the admin session cookie */
export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Check if the current request is authenticated (for page/route-handler use) */
export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return !!token && verifyToken(token);
}

/** Check auth from a NextRequest (for middleware) */
export function isAdminAuthenticatedFromRequest(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return !!token && verifyToken(token);
}
