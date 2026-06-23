import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import { isAdminAuthenticated } from "@/lib/auth";
import { getStop, updateStop } from "@/lib/content";
import type { Lang, Stop } from "@/types/content";

const IS_VERCEL = !!process.env.VERCEL || !!process.env.BLOB_READ_WRITE_TOKEN;
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

  const stopIdRaw = formData.get("stopId");
  const langRaw = formData.get("lang");
  const stopId = typeof stopIdRaw === "string" ? Number(stopIdRaw) : NaN;
  const lang = langRaw === "vi" || langRaw === "en" ? langRaw : null;

  if (!Number.isInteger(stopId) || stopId < 1 || !lang) {
    return NextResponse.json({ message: "Missing valid stopId/lang" }, { status: 400 });
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

  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "m4a";
  const ext = ["mp3", "m4a", "ogg", "wav"].includes(rawExt) ? rawExt : "m4a";

  // Use a versioned filename so browsers do not keep playing a cached old file.
  const baseName = `stop${stopId}_${lang}_${Date.now()}.${ext}`;
  const sanitized = baseName
    .replace(/[^a-zA-Z0-9_\-\.]/g, "")
    .toLowerCase();

  const buffer = Buffer.from(await file.arrayBuffer());
  let publicPath: string;

  if (IS_VERCEL) {
    // Upload to Vercel Blob
    const blob = await put(`audio/${sanitized}`, buffer, {
      access: "public",
      contentType: contentType || `audio/${ext}`,
      allowOverwrite: true,
    });
    publicPath = blob.url;
  } else {
    // Local: write to public/audio/
    await fs.mkdir(AUDIO_DIR, { recursive: true });
    const destPath = path.join(AUDIO_DIR, sanitized);
    await fs.writeFile(destPath, buffer);
    publicPath = `/audio/${sanitized}`;
  }

  const current = await getStop(stopId) as Stop | undefined;
  if (!current) {
    return NextResponse.json({ message: `Stop ${stopId} was not found` }, { status: 404 });
  }

  const updated = await updateStop(stopId, {
    audio: {
      ...current.audio,
      [lang as Lang]: publicPath,
    },
  });

  return NextResponse.json({
    ok: true,
    path: publicPath,
    filename: sanitized,
    size: file.size,
    stop: updated,
  });
}
