export const QUEUES = { discovery: "listing-discovery", scoring: "lead-scoring", outreach: "outreach", replies: "reply-monitor", generation: "tour-generation", metrics: "daily-metrics" } as const;
export type JobName = keyof typeof QUEUES;
export interface JobDispatcher { enqueue<T>(queue: JobName, payload: T, options?: { delayMs?: number; jobId?: string }): Promise<void>; }
export class InMemoryJobDispatcher implements JobDispatcher { jobs: { queue: JobName; payload: unknown }[] = []; async enqueue<T>(queue: JobName, payload: T) { this.jobs.push({ queue, payload }); } }
