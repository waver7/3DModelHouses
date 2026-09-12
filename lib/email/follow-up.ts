export type FollowUpContext = { hasReply: boolean; unsubscribed: boolean; bounced: boolean; permissionGranted: boolean; manualStop: boolean; listingStatus: string };
export function followUpStopReason(c: FollowUpContext): string | null {
  if (c.unsubscribed) return "UNSUBSCRIBED"; if (c.hasReply) return "REPLIED"; if (c.bounced) return "BOUNCED";
  if (c.permissionGranted) return "PERMISSION_GRANTED"; if (c.manualStop) return "MANUAL_STOP";
  if (["PENDING", "SOLD"].includes(c.listingStatus)) return `LISTING_${c.listingStatus}`; return null;
}
export const DEFAULT_CADENCE_DAYS = [0, 3, 7, 14] as const;
