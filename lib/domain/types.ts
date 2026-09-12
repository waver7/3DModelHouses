export type ListingInput = {
  externalId: string; address: string; city: string; state: string; zip: string;
  price: number; daysOnMarket: number; photoCount: number; priceReductionCount: number;
  has3DTour: boolean; hasVirtualTour: boolean; status: "ACTIVE" | "PENDING" | "SOLD" | "OTHER";
  professionallyMaintained?: boolean;
};
export type PermissionState = "NOT_REQUESTED" | "REQUESTED" | "GRANTED" | "DENIED" | "REVOKED";
export type AutomationMode = "DRY_RUN" | "REVIEW" | "AUTO";
