# Never86 X ship checklist (overnight)

Honesty: only mark Done with evidence (path or live URL).

## Product
- [x] Sample ticket rail + try flows — `src/app/try/**`, `src/app/check/**`
- [x] Onboarding — `/onboarding`
- [x] Pricing (fail-closed paid seats) — `/pricing`, `/api/billing/checkout`
- [x] Admin stub — `/admin`
- [x] Support index — `/support`
- [x] Privacy — `/privacy` (existing)
- [x] Terms — `/terms`
- [ ] Real auth sessions — **Deferred**: AUTH_SECRET + provider keys
- [ ] Live OCR camera — **Deferred**: vision API keys
- [ ] Product analytics — **Deferred**: no fake charts

## Enterprise
- [x] Health — `/api/health`
- [x] Audit log helper + API — `src/lib/audit.ts`, `/api/audit`
- [x] In-memory rate limit — `src/lib/rateLimit.ts`
- [x] CI — `.github/workflows/ci.yml`
- [x] `.env.example`
- [x] Incident plan — `docs/INCIDENT.md`
- [ ] Staging+prod secrets — **Deferred**: Vercel git link + env
- [ ] Sentry — **Deferred**: SENTRY_DSN
- [ ] SOC2 evidence pack — **Deferred**: cannot claim overnight
- [ ] DB backups — **Deferred**: DATABASE_URL
- [ ] Load tests — **Deferred**: runner + target URL

## GTM / ops
- [x] Status stub — `/status`
- [x] Email templates (not sending) — `docs/email/*`
- [ ] Custom domain — **Deferred**: registrar DNS
- [ ] Transactional send — **Deferred**: Resend/API key
- [ ] Stripe live checkout — **Deferred**: STRIPE_SECRET_KEY + price IDs
- [ ] App stores — **Deferred**: web-first; listings not started
- [ ] Verified production URL — fill when deploy confirms

## Tests
- [x] Smoke test — `test/smoke.test.mjs`
- [ ] Playwright E2E — **Deferred**: after auth
