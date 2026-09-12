import type { ListingInput } from "./types";
export type ScoreResult = { score: number; eligible: boolean; reason: string; factors: string[] };
export type ScoreConfig = { minimumDaysOnMarket: number; minimumPrice: number; minimumPhotos: number };
export const defaultScoreConfig: ScoreConfig = { minimumDaysOnMarket: 45, minimumPrice: 300_000, minimumPhotos: 10 };
export function scoreListing(listing: ListingInput, config = defaultScoreConfig): ScoreResult {
  const eligible = listing.status === "ACTIVE" && listing.daysOnMarket >= config.minimumDaysOnMarket &&
    listing.price >= config.minimumPrice && listing.photoCount >= config.minimumPhotos &&
    !listing.has3DTour && !listing.hasVirtualTour;
  let score = 0; const factors: string[] = [];
  // DOM tiers are intentionally cumulative: greater staleness carries incrementally more signal.
  if (listing.daysOnMarket >= 45) { score += 25; factors.push("45+ days on market"); }
  if (listing.daysOnMarket >= 60) { score += 20; factors.push("60+ days on market"); }
  if (listing.daysOnMarket >= 90) { score += 10; factors.push("90+ days on market"); }
  if (listing.price >= 400_000) { score += 15; factors.push("$400k+ price"); }
  if (listing.price >= 600_000) { score += 10; factors.push("$600k+ price"); }
  if (listing.priceReductionCount > 0) { score += 15; factors.push(`${listing.priceReductionCount} price reduction${listing.priceReductionCount === 1 ? "" : "s"}`); }
  if (listing.photoCount >= 20) { score += 10; factors.push("20+ photos"); }
  if (!listing.has3DTour && !listing.hasVirtualTour) { score += 10; factors.push("no virtual tour"); }
  if (listing.professionallyMaintained) { score += 5; factors.push("maintained description"); }
  score = Math.min(100, score);
  const dollars = `$${Math.round(listing.price / 1000)}k`;
  return { score, eligible, factors, reason: `${score}/100 — ${dollars} listing, ${listing.daysOnMarket} DOM, ${listing.photoCount} photos, ${listing.priceReductionCount ? `${listing.priceReductionCount} price reduction${listing.priceReductionCount === 1 ? "" : "s"}` : "no price reductions"}, ${listing.has3DTour || listing.hasVirtualTour ? "tour present" : "no virtual tour"}.` };
}
