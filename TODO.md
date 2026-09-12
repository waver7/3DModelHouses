# Delivery plan

## MVP (implemented)
- [x] Modular Next.js/TypeScript foundation and Prisma domain schema
- [x] Config validation with safe `DRY_RUN` defaults and emergency switches
- [x] Listing-source, email, payment, AI, queue, and virtual-tour contracts with mocks
- [x] Deterministic qualification/scoring, suppression/rate-limit controls, follow-up stops
- [x] Permission gate, generation state machine, response classification, webhook signature verification
- [x] Dashboard, lead detail, review, settings, expiring preview routes
- [x] Scheduler endpoint/workflow, audit-friendly results, fictional Ohio seed data
- [x] Unit tests for all safety-critical workflows

## Integration checklist (requires owner access)
- [ ] Select and authorize a licensed MLS/data feed; implement its documented adapter
- [ ] Provision PostgreSQL and Redis; run the initial Prisma migration
- [ ] Verify sending domain and inbound webhook with Resend, SendGrid, or Gmail
- [ ] Supply OpenAI credentials and approve model/data-retention policy
- [ ] Select a documented tour vendor and complete a sandbox generation
- [ ] Configure Stripe product, webhook endpoint, tax, receipts, and fulfillment
- [ ] Add authenticated admin access, object storage, antivirus scanning, and secrets manager
- [ ] Legal review of consent language, retention, privacy notice, and outreach market
- [ ] Load/performance testing before increasing send volume or enabling `AUTO`

## Phase 2
Multi-state feeds, brokerage portals, subscriptions, social-video pipeline, conversion models,
white-labeling, advanced experiments, recurring packages, and analytics warehouse exports.
