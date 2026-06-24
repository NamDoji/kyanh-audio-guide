import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";
import { promises as fs } from "fs";
import path from "path";
import { isAdminAuthenticated } from "@/lib/auth";
import { getStop, updateStop } from "@/lib/content";
import type { Lang } from "@/types/content";

const IS_VERCEL = !!process.env.VERCEL || !!process.env.BLOB_READ_WRITE_TOKEN;
const AUDIO_DIR = path.join(process.cwd(), "public", "audio");
const ALLOWED_TYPES = [
  "audio/mp4",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/x-m4a",
  "audio/m4a",
  "audio/webm",
];
const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

/**
 * GET /api/admin/upload?pathname=audio/stop1_vi_xxx.mp3
 * → Trả về client token để browser upload thẳng lên Vercel Blob CDN.
 * File không đi qua serverless → không bị giới hạn 4.5 MB.
 */
export async function GET(request: Request): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const pathname = searchParams.get("pathname");
  if (!pathname) {
    return NextResponse.json({ message: "Missing pathname" }, { status: 400 });
  }

  const token = await generateClientTokenFromReadWriteToken({
    pathname,
    allowedContentTypes: ALLOWED_TYPES,
    maximumSizeInBytes: MAX_SIZE,
    validUntil: Date.now() + 5 * 60 * 1000, // 5 phút
  });

  return NextResponse.json({ token });
}

/**
 * POST /api/admin/upload (multipart/form-data)
 * Fallback cho local dev (không có Blob token) hoặc file nhỏ.
 */
export async function POST(request: Request): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ message: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ message: "No file provided" }, { status: 400 });

  const stopIdRaw = formData.get("stopId");
  const langRaw = formData.get("lang");
  const stopId = typeof stopIdRaw === "string" ? Number(stopIdRaw) : NaN;
  const lang: Lang | null = langRaw === "vi" || langRaw === "en" ? (langRaw as Lang) : null;

  if (!Number.isInteger(stopId) || stopId < 1 || !lang) {
    return NextResponse.json({ message: "Missing valid stopId/lang" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ message: "File quá lớn (max 50 MB)" }, { status: 400 });
  }

  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "m4a";
  const ext = ["mp3", "m4a", "ogg", "wav"].includes(rawExt) ? rawExt : "m4a";
  const sanitized = `stop${stopId}_${lang}_${Date.now()}.${ext}`
    .replace(/[^a-zA-Z0-9_\-.]/g, "")
    .toLowerCase();

  const buffer = Buffer.from(await file.arrayBuffer());
  let publicPath: string;

  if (IS_VERCEL) {
    const blob = await put(`audio/${sanitized}`, buffer, {
      access: "public",
      contentType: file.type || `audio/${ext}`,
      allowOverwrite: true,
    });
    publicPath = blob.url;
  } else {
    await fs.mkdir(AUDIO_DIR, { recursive: true });
    await fs.writeFile(path.join(AUDIO_DIR, sanitized), buffer);
    publicPath = `/audio/${sanitized}`;
  }

  const current = await getStop(stopId);
  if (!current) return NextResponse.json({ message: `Stop ${stopId} not found` }, { status: 404 });

  const updated = await updateStop(stopId, {
    audio: { ...current.audio, [lang]: publicPath },
  });

  return NextResponse.json({ ok: true, path: publicPath, stop: updated });
}
