import { getConfig } from "../config/env";
import type { JobDispatcher } from "../queue/contracts";
export async function scheduleDailyPipeline(dispatcher: JobDispatcher, now = new Date()) {
  const config = getConfig(); if (config.PAUSE_DISCOVERY) return { queued: [], reason: "Discovery paused" };
  const runId = now.toISOString().slice(0, 10); const queued = ["discovery", "scoring", "outreach", "replies", "generation", "metrics"] as const;
  for (const queue of queued) await dispatcher.enqueue(queue, { runId, requestedAt: now.toISOString() }, { jobId: `${queue}-${runId}` });
  return { queued, mode: config.AUTOMATION_MODE, runId };
}
