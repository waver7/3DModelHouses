export type OutboundEmail = { to: string; from: string; subject: string; text: string; idempotencyKey: string };
export type SendResult = { providerMessageId: string; accepted: boolean; simulated?: boolean };
export interface EmailProvider { send(message: OutboundEmail): Promise<SendResult>; }
export class MockEmailProvider implements EmailProvider {
  readonly sent: OutboundEmail[] = [];
  async send(message: OutboundEmail): Promise<SendResult> { this.sent.push(message); return { providerMessageId: `mock-${message.idempotencyKey}`, accepted: true, simulated: true }; }
}
