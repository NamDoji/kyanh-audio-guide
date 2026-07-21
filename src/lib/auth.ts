import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "kyanh_admin_session";
const SESSION_VALUE = "authenticated";

/** Sign a session token using HMAC-SHA256 */
function makeToken(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    // Fail loud in production; dev falls back to insecure token
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_SECRET environment variable is not set");
    }
    return Buffer.from(`${SESSION_VALUE}:dev-only`).toString("base64url");
  }
  return crypto.createHmac("sha256", secret).update(SESSION_VALUE).digest("base64url");
}

function verifyToken(token: string): boolean {
  try {
    const expected = makeToken();
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
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
