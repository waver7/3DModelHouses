import { NextRequest, NextResponse } from "next/server";
import { verifyHmacSignature } from "@/lib/payments/provider";
export async function POST(request: NextRequest) {
  const payload = await request.text(); const signature = request.headers.get("x-mvp-signature") ?? ""; const secret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  if (!verifyHmacSignature(payload, signature, secret)) return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  // This endpoint deliberately does not claim Stripe compatibility. Replace HMAC verifier with the official SDK before enabling payments.
  return NextResponse.json({ received: true, action: "audit_only", note: "Payment state unchanged until documented provider adapter is configured." });
}
