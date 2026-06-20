import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdminAuthenticated } from "@/lib/auth";

const AUDIO_DIR = path.join(process.cwd(), "public", "audio");
const ALLOWED_TYPES = new Set(["audio/mp4", "audio/mpeg", "audio/ogg", "audio/wav", "audio/x-m4a", "audio/m4a"]);
const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  // Validate type
  const contentType = file.type.toLowerCase();
  if (!ALLOWED_TYPES.has(contentType) && !file.name.match(/\.(mp3|m4a|ogg|wav)$/i)) {
    return NextResponse.json({ message: "Invalid file type. Allowed: mp3, m4a, ogg, wav" }, { status: 400 });
  }

  // Validate size
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ message: "File quá lớn (max 50 MB)" }, { status: 400 });
  }

  // Sanitize filename: only allow stop{n}_{lang}.{ext} pattern
  const sanitized = file.name
    .replace(/[^a-zA-Z0-9_\-\.]/g, "")
    .toLowerCase();

  // Ensure audio dir exists
  await fs.mkdir(AUDIO_DIR, { recursive: true });

  const destPath = path.join(AUDIO_DIR, sanitized);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(destPath, buffer);

  const publicPath = `/audio/${sanitized}`;
  return NextResponse.json({ ok: true, path: publicPath, filename: sanitized, size: file.size });
}
