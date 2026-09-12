import { createHmac, timingSafeEqual } from "node:crypto";
export interface PaymentProvider { createCheckout(input: { leadId: string; priceCents: number; successUrl: string; cancelUrl: string }): Promise<{ checkoutUrl: string; sessionId: string }>; verifyWebhook(payload: string, signature: string): Promise<{ type: string; leadId?: string; paidAmount?: number }>; }
export class MockPaymentProvider implements PaymentProvider {
  async createCheckout(input: { leadId: string }) { return { checkoutUrl: `/mock-checkout/${input.leadId}`, sessionId: `mock-${input.leadId}` }; }
  async verifyWebhook(): Promise<{ type: string; leadId?: string; paidAmount?: number }> { throw new Error("Mock payment provider does not accept payment webhooks"); }
}
export function verifyHmacSignature(payload: string, signature: string, secret: string): boolean {
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(expected); const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
