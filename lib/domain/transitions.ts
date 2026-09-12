export type GenerationState = "PENDING" | "PREPROCESSING" | "UPLOADING" | "GENERATING" | "QUALITY_CHECK" | "READY" | "FAILED" | "HUMAN_REVIEW";
const generationTransitions: Record<GenerationState, GenerationState[]> = {
  PENDING: ["PREPROCESSING", "FAILED"], PREPROCESSING: ["UPLOADING", "FAILED"],
  UPLOADING: ["GENERATING", "FAILED"], GENERATING: ["QUALITY_CHECK", "FAILED"],
  QUALITY_CHECK: ["READY", "HUMAN_REVIEW", "FAILED"], HUMAN_REVIEW: ["READY", "PREPROCESSING", "FAILED"],
  READY: [], FAILED: ["PENDING"],
};
export function assertGenerationTransition(from: GenerationState, to: GenerationState): void {
  if (!generationTransitions[from].includes(to)) throw new Error(`Invalid generation transition: ${from} -> ${to}`);
}
export type ListingState = "ACTIVE" | "PENDING" | "SOLD" | "WITHDRAWN" | "EXPIRED" | "UNKNOWN";
const listingTransitions: Record<ListingState, ListingState[]> = { ACTIVE: ["PENDING", "SOLD", "WITHDRAWN", "EXPIRED"], PENDING: ["ACTIVE", "SOLD", "WITHDRAWN"], SOLD: [], WITHDRAWN: ["ACTIVE"], EXPIRED: ["ACTIVE"], UNKNOWN: ["ACTIVE", "PENDING", "SOLD", "WITHDRAWN", "EXPIRED"] };
export function canTransitionListing(from: ListingState, to: ListingState): boolean { return from === to || listingTransitions[from].includes(to); }
