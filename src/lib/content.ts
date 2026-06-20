import { promises as fs } from "fs";
import path from "path";
import type { FeedbackPayload, SiteContent, Stop } from "@/types/content";

const dataDir = path.join(process.cwd(), "data");
const stopsPath = path.join(dataDir, "stops.json");
const feedbackPath = path.join(dataDir, "feedback.jsonl");

export async function getContent(): Promise<SiteContent> {
  const raw = await fs.readFile(stopsPath, "utf8");
  return JSON.parse(raw) as SiteContent;
}

export async function getStops(): Promise<Stop[]> {
  const content = await getContent();
  return content.stops.sort((a, b) => a.id - b.id);
}

export async function getStop(id: number): Promise<Stop | undefined> {
  const stops = await getStops();
  return stops.find((stop) => stop.id === id);
}

export async function updateStop(id: number, patch: Partial<Stop>): Promise<Stop> {
  const content = await getContent();
  const index = content.stops.findIndex((stop) => stop.id === id);

  if (index < 0) {
    throw new Error(`Stop ${id} was not found`);
  }

  const updated = {
    ...content.stops[index],
    ...patch,
    id,
  };

  content.stops[index] = updated;
  await fs.writeFile(stopsPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  return updated;
}

export async function appendFeedback(payload: FeedbackPayload): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  const record = {
    ...payload,
    createdAt: new Date().toISOString(),
  };
  await fs.appendFile(feedbackPath, `${JSON.stringify(record)}\n`, "utf8");
}

export function absoluteUrl(pathname: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new URL(pathname, base).toString();
}
