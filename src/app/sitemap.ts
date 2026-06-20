import type { MetadataRoute } from "next";
import { absoluteUrl, getStops } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stops = await getStops();
  const staticRoutes = ["", "/language", "/stops", "/map", "/qr", "/credits", "/feedback"];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route || "/"),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...stops.map((stop) => ({
      url: absoluteUrl(`/stops/${stop.id}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
