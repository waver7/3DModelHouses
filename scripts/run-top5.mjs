#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export function scoreListing(listing) {
  let score = 0;
  if (listing.daysOnMarket >= 45) score += 25;
  if (listing.daysOnMarket >= 60) score += 20;
  if (listing.daysOnMarket >= 90) score += 10;
  if (listing.price >= 400000) score += 15;
  if (listing.price >= 600000) score += 10;
  if (listing.priceReductionCount > 0) score += 15;
  if (listing.photoCount >= 20) score += 10;
  if (!listing.has3DTour && !listing.hasVirtualTour) score += 10;
  if (listing.professionallyMaintained === true) score += 5;
  return Math.min(100, score);
}

export function qualify(listing, env = process.env) {
  const targets = (env.TARGET_CITIES ?? "Miamisburg,Springboro,Centerville,Beavercreek,Dayton").split(",").map((x) => x.trim().toLowerCase());
  const zips = (env.TARGET_ZIPS ?? "45342").split(",").map((x) => x.trim());
  const confidence = listing.agent?.contactConfidence;
  const verified = confidence === "VERIFIED" || confidence === "PUBLIC_BUSINESS_CONTACT";
  return listing.sourceAuthorized === true && (targets.includes(listing.city.toLowerCase()) || zips.includes(listing.zip)) &&
    listing.status === "ACTIVE" && listing.daysOnMarket >= Number(env.MIN_DAYS_ON_MARKET ?? 45) &&
    listing.price >= Number(env.MIN_LISTING_PRICE ?? 300000) && listing.photoCount >= Number(env.MIN_PHOTO_COUNT ?? 10) &&
    !listing.has3DTour && !listing.hasVirtualTour && verified && typeof listing.agent.email === "string";
}

function firstName(name) { return name.trim().split(/\s+/)[0]; }
export function draftPermissionEmail(listing, env = process.env) {
  const sender = env.EMAIL_FROM_NAME ?? "Listing Revival";
  const address = env.BUSINESS_ADDRESS ?? "[CONFIGURE BUSINESS_ADDRESS BEFORE SENDING]";
  const unsubscribe = `${env.APP_URL ?? "http://localhost:3000"}/unsubscribe?email=${encodeURIComponent(listing.agent.email)}`;
  return {
    to: listing.agent.email,
    subject: `Quick idea for ${listing.address}`,
    text: `Hi ${firstName(listing.agent.name)},\n\nI came across your listing at ${listing.address}. I noticed the property has been on the market for a little while.\n\nI create AI-powered interactive property walkthroughs using listing photos you already have, so there is no need to schedule another photographer or regain access to the property. With ${listing.photoCount} existing photos, ${listing.address} appears to be a strong candidate.\n\nIf you would like, I can create a complimentary preview. Just reply YES, and I will send a secure authorization link so you can confirm that you have authority to let us use the listing media for the preview. No images will be processed before that authorization is recorded.\n\nBest,\n${sender}\n\nAI-generated previews are visualizations and are not intended for measurements or architectural accuracy.\nBusiness address: ${address}\nUnsubscribe: ${unsubscribe}`
  };
}

export function buildTopFive(listings, env = process.env) {
  return listings.filter((x) => qualify(x, env)).map((listing) => ({ ...listing, score: scoreListing(listing) }))
    .sort((a, b) => b.score - a.score || b.daysOnMarket - a.daysOnMarket).slice(0, 5)
    .map((listing) => ({ listing, email: draftPermissionEmail(listing, env), action: "DRAFT_ONLY_PERMISSION_REQUIRED" }));
}

async function main() {
  const inputPath = resolve(process.argv[2] ?? "data/authorized-listings.example.json");
  const outputPath = resolve(process.argv[3] ?? "reports/top-5-dry-run.json");
  const listings = JSON.parse(await readFile(inputPath, "utf8"));
  if (!Array.isArray(listings)) throw new Error("Input must be a JSON array of authorized listing records");
  const result = buildTopFive(listings);
  await mkdir(resolve(outputPath, ".."), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), automationMode: "DRY_RUN", safetyNotice: "No email sent and no tour generated. Explicit image-use permission is required before generation.", leads: result }, null, 2)}\n`);
  console.log(`Prepared ${result.length} permission-first drafts at ${outputPath}`);
  for (const { listing, email } of result) console.log(`${listing.score}/100 | ${listing.address} | ${email.to} | ${email.subject}`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${resolve(process.argv[1])}`).href) main().catch((error) => { console.error(error.message); process.exitCode = 1; });
