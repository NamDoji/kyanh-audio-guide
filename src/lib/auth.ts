import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import crypto from "crypto";

export type AdminRole = "admin" | "editor";

const COOKIE_NAME = "kyanh_admin_session";
const PAYLOAD_ADMIN = "authenticated:admin";
const PAYLOAD_EDITOR = "authenticated:editor";
const PAYLOAD_LEGACY = "authenticated"; // tokens issued before role system

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/** Timing-safe password comparison for login routes */
export function safePasswordCompare(input: string, stored: string): boolean {
  try {
    const h1 = crypto.createHmac("sha256", "pw-cmp").update(input).digest();
    const h2 = crypto.createHmac("sha256", "pw-cmp").update(stored).digest();
    return crypto.timingSafeEqual(h1, h2);
  } catch {
    return false;
  }
}

function hmac(payload: string): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_SECRET environment variable is not set");
    }
    return Buffer.from(`${payload}:dev-only`).toString("base64url");
  }
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function makeToken(role: AdminRole): string {
  return hmac(role === "admin" ? PAYLOAD_ADMIN : PAYLOAD_EDITOR);
}

function verifyRole(token: string): AdminRole | null {
  if (safeCompare(token, hmac(PAYLOAD_ADMIN))) return "admin";
  if (safeCompare(token, hmac(PAYLOAD_EDITOR))) return "editor";
  // Accept legacy tokens (before role system) as admin
  if (safeCompare(token, hmac(PAYLOAD_LEGACY))) return "admin";
  return null;
}

export async function setAdminSession(role: AdminRole = "admin"): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, makeToken(role), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return !!token && verifyRole(token) !== null;
}

export async function getAdminRole(): Promise<AdminRole | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyRole(token);
}

export function isAdminAuthenticatedFromRequest(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return !!token && verifyRole(token) !== null;
}
