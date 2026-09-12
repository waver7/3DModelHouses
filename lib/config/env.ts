import { z } from "zod";
const bool = z.string().default("false").transform((v) => v === "true");
const schema = z.object({
  AUTOMATION_MODE: z.enum(["DRY_RUN", "REVIEW", "AUTO"]).default("DRY_RUN"),
  TARGET_ZIPS: z.string().default("45342"),
  TARGET_CITIES: z.string().default("Miamisburg,Springboro,Centerville,Beavercreek,Dayton"),
  MIN_DAYS_ON_MARKET: z.coerce.number().int().default(45),
  PREFERRED_DAYS_ON_MARKET: z.coerce.number().int().default(60),
  MIN_LISTING_PRICE: z.coerce.number().int().default(300000),
  MIN_PHOTO_COUNT: z.coerce.number().int().default(10),
  MIN_LEAD_SCORE: z.coerce.number().int().default(45),
  EMAIL_DAILY_LIMIT: z.coerce.number().int().positive().default(30),
  EMAIL_DOMAIN_DAILY_LIMIT: z.coerce.number().int().positive().default(3),
  BASE_PACKAGE_PRICE_CENTS: z.coerce.number().int().positive().default(24900),
  BUSINESS_ADDRESS: z.string().default("CONFIGURE BUSINESS ADDRESS"),
  EMAIL_FROM_NAME: z.string().default("Listing Revival"),
  EMAIL_FROM_ADDRESS: z.string().email().default("hello@example.com"),
  OPENAI_MODEL: z.string().default("gpt-5-mini"),
  REPLY_CONFIDENCE_THRESHOLD: z.coerce.number().min(0).max(1).default(0.8),
  QC_CONFIDENCE_THRESHOLD: z.coerce.number().min(0).max(1).default(0.85),
  PAUSE_ALL_OUTREACH: bool, PAUSE_GENERATION: bool, PAUSE_DISCOVERY: bool,
});
export type AppConfig = z.infer<typeof schema>;
export function getConfig(input: NodeJS.ProcessEnv = process.env): AppConfig { return schema.parse(input); }
