import { NextResponse } from "next/server";
import { setAdminSession, safePasswordCompare } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { password?: string };

  if (!body.password) {
    return NextResponse.json({ message: "Sai mật khẩu / Incorrect password" }, { status: 401 });
  }

  if (process.env.ADMIN_PASSWORD && safePasswordCompare(body.password, process.env.ADMIN_PASSWORD)) {
    await setAdminSession("admin");
    return NextResponse.json({ ok: true, role: "admin" });
  }

  if (process.env.EDITOR_PASSWORD && safePasswordCompare(body.password, process.env.EDITOR_PASSWORD)) {
    await setAdminSession("editor");
    return NextResponse.json({ ok: true, role: "editor" });
  }

  return NextResponse.json({ message: "Sai mật khẩu / Incorrect password" }, { status: 401 });
}
