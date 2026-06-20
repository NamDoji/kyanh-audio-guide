import { NextResponse } from "next/server";
import { setAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { password?: string };

  if (!body.password || body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ message: "Sai mật khẩu / Incorrect password" }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
