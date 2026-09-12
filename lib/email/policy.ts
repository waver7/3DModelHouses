import type { AutomationMode } from "../domain/types";
export type SendContext = { email: string; confidence: "VERIFIED" | "PUBLIC_BUSINESS_CONTACT" | "UNVERIFIED" | "UNKNOWN"; manualApproval?: boolean; suppressed: boolean; hasReply: boolean; listingStatus: string; dailySent: number; domainDailySent: number; dailyLimit: number; domainLimit: number; mode: AutomationMode; paused?: boolean };
export function evaluateSend(ctx: SendContext): { allowed: boolean; reason?: string; requiresReview?: boolean } {
  if (ctx.paused) return { allowed: false, reason: "Outreach paused" };
  if (ctx.suppressed) return { allowed: false, reason: "Contact is permanently suppressed" };
  if (ctx.hasReply) return { allowed: false, reason: "Follow-ups stop after a reply" };
  if (["PENDING", "SOLD", "DO_NOT_CONTACT"].includes(ctx.listingStatus)) return { allowed: false, reason: `Stopped for status ${ctx.listingStatus}` };
  if (!(["VERIFIED", "PUBLIC_BUSINESS_CONTACT"].includes(ctx.confidence) || ctx.manualApproval)) return { allowed: false, reason: "Contact is not verified" };
  if (ctx.dailySent >= ctx.dailyLimit) return { allowed: false, reason: "Daily limit reached" };
  if (ctx.domainDailySent >= ctx.domainLimit) return { allowed: false, reason: "Per-domain limit reached" };
  if (ctx.mode === "DRY_RUN") return { allowed: false, reason: "Dry run: action recorded, not sent" };
  if (ctx.mode === "REVIEW") return { allowed: false, reason: "Awaiting human approval", requiresReview: true };
  return { allowed: true };
}
export function normalizeEmail(email: string): string { return email.trim().toLowerCase(); }
export function renderCompliantFooter(address: string, unsubscribeUrl: string): string { return `\n\n—\nBusiness address: ${address}\nUnsubscribe: ${unsubscribeUrl}`; }
