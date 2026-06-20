import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getFeedbackRecords, getVisitRecords } from "@/lib/content";

function toDateKey(value: string) {
  return value.slice(0, 10);
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [visits, feedback] = await Promise.all([getVisitRecords(), getFeedbackRecords()]);
  const todayKey = toDateKey(new Date().toISOString());
  const stopVisits = new Map<string, number>();
  const pathVisits = new Map<string, number>();
  const dailyVisits = new Map<string, number>();

  for (const visit of visits) {
    pathVisits.set(visit.path, (pathVisits.get(visit.path) ?? 0) + 1);
    dailyVisits.set(toDateKey(visit.createdAt), (dailyVisits.get(toDateKey(visit.createdAt)) ?? 0) + 1);

    const match = visit.path.match(/^\/stops\/(\d+)/);
    if (match) stopVisits.set(match[1], (stopVisits.get(match[1]) ?? 0) + 1);
  }

  const ratingTotal = feedback.reduce((sum, item) => sum + Number(item.rating || 0), 0);

  return NextResponse.json({
    totalVisits: visits.length,
    todayVisits: visits.filter((visit) => toDateKey(visit.createdAt) === todayKey).length,
    totalFeedback: feedback.length,
    averageRating: feedback.length ? Number((ratingTotal / feedback.length).toFixed(1)) : 0,
    topPaths: [...pathVisits.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count })),
    stopVisits: [...stopVisits.entries()]
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([stopId, count]) => ({ stopId: Number(stopId), count })),
    dailyVisits: [...dailyVisits.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14)
      .map(([date, count]) => ({ date, count })),
    latestFeedback: feedback.slice(-10).reverse(),
  });
}
