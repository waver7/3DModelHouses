import { NextRequest, NextResponse } from "next/server";
import { scheduleDailyPipeline } from "@/lib/domain/daily-run";
import { InMemoryJobDispatcher } from "@/lib/queue/contracts";
export async function POST(request: NextRequest) {
  const configured = process.env.CRON_SECRET;
  if (!configured || request.headers.get("authorization") !== `Bearer ${configured}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dispatcher = new InMemoryJobDispatcher(); const result = await scheduleDailyPipeline(dispatcher);
  return NextResponse.json({ ...result, jobs: dispatcher.jobs });
}
