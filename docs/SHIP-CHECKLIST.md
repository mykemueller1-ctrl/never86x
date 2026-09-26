# Never86 X ship checklist

Checked 2026-09-24 against production git deploy of `main` `2cd449f4909c35d1799c1aef7e25244875535acf` (“fix: npm test points at smoke.test.mjs”).

Public host: https://never86x.vercel.app  
Vercel project `never86x` (`prj_vbw6o2h4AcR5sgmMPyPpnS25xYEp`), production deployment `dpl_8KNxweBCA4ePZfBrt1B6gp6a95Yu`, source `git`, ref `main`, that SHA, state `READY`.

Done means an HTTP check against that host on this pass. A route that only exists in the repo is not Done.

## Live

- [x] Health — https://never86x.vercel.app/api/health returned 200 `{"ok":true,"service":"never86x","auth":"missing","stripe":"missing","sentry":"missing","database":"missing"}`.
- [x] Home — https://never86x.vercel.app/ returned 200. Copy includes “YOU’RE ON THE PASS” and the free-seat line versus Restaurant365.
- [x] Pricing page is up — https://never86x.vercel.app/pricing returned 200 on `2cd449f`. That live HTML still prints `$0` for seat 1. This branch replaces that figure with the word Free. Paid seats stay TBD. No new dollar amount.
- [x] Terms — https://never86x.vercel.app/terms returned 200.
- [x] Privacy — https://never86x.vercel.app/privacy returned 200.
- [x] Status page — https://never86x.vercel.app/status returned 200. It is a manual board (app Estimated, auth Missing, Stripe Missing). The health row’s Verified badge is static copy, not an uptime probe.
- [x] Support — https://never86x.vercel.app/support returned 200.
- [x] Onboarding — https://never86x.vercel.app/onboarding returned 200.
- [x] Sample desk — https://never86x.vercel.app/try and https://never86x.vercel.app/try/desk returned 200, plus `/try/labor`, `/try/recipes`, `/try/watch`.
- [x] Private-check wall — https://never86x.vercel.app/check/invoices returned 200 (sign-in still Missing; see auth below).
- [x] Seat — https://never86x.vercel.app/seat returned 200.
- [x] Contact / email data — https://never86x.vercel.app/contact and https://never86x.vercel.app/email-data returned 200.
- [x] Admin stub — https://never86x.vercel.app/admin returned 200 and states the gate is not a session. No operator list is on the page.
- [x] Audit fail-closed — `GET` https://never86x.vercel.app/api/audit returned 401 `{"ok":false,"honesty":"Missing","reason":"ADMIN_EMAILS + x-admin-email required"}`.
- [x] Checkout fail-closed — `POST` https://never86x.vercel.app/api/billing/checkout returned 503 `Stripe not configured. Seat 1 stays free. Seats 2–3 need STRIPE_SECRET_KEY + STRIPE_PRICE_SEAT2.`
- [x] CI on this SHA — https://github.com/mykemueller1-ctrl/never86x/actions/runs/35949340558 success (lint, build, test). Local `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` passed on the same commit.

## Deferred

- [ ] **Sign-in sessions.** Health reports `auth: missing`. Myke owes `AUTH_SECRET` or `NEXTAUTH_SECRET`, plus the provider keys he chooses (Google client id/secret, or Clerk `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`). Do not treat `/seat` or `/admin` as authenticated.
- [ ] **Admin allowlist.** Audit stays 401 until Myke sets `ADMIN_EMAILS`. Header `x-admin-email` is not a session. Real auth still has to land first.
- [ ] **Stripe Checkout session.** Keys are absent, and this commit does not create a Checkout Session even if they are set (route returns 501 “wiring is not live”). Myke owes `STRIPE_SECRET_KEY` and `STRIPE_PRICE_SEAT2`, then a commit that calls Stripe. No charge was made.
- [ ] **Sentry.** Health reports `sentry: missing`. Myke owes `SENTRY_DSN`.
- [ ] **Database and backups.** Health reports `database: missing`. Myke owes `DATABASE_URL` and a backup plan after a database exists.
- [ ] **Transactional email.** Templates only: `docs/email/welcome.md`, `docs/email/support-ack.md`. Myke owes a send provider key (Resend or SMTP). Nothing was sent.
- [ ] **Camera / OCR and Drive ingest.** Docs only: `docs/CAPTURE-EXTRACT-PIPELINE.md`, `docs/AGENT-INGESTION.md`. Myke owes the vision and Google OAuth credentials. No live read was claimed.
- [ ] **Product analytics.** No metrics endpoint. Do not invent charts.
- [ ] **Custom domain.** `https://never86x.com/api/health` did not resolve (curl exit 6, “Could not resolve host”). Myke owes registrar DNS pointed at the Vercel project.
- [ ] **Team hostname without Vercel login.** `https://never86x-myke-muellers-projects.vercel.app/api/health` returned 302 to `https://vercel.com/sso-api`. The public URL is `https://never86x.vercel.app`. Myke owes a decision to turn off Vercel Authentication on team deployment URLs if those hostnames must be public too.
- [ ] **Staging env split.** One production deploy of `main`. Myke owes a Vercel staging environment and its env vars if staging must differ from production.
- [ ] **SOC2 pack.** Not claimed. No evidence.
- [ ] **Playwright and load tests.** Smoke is `test/smoke.test.mjs` via `npm test`. No browser project and no load target beyond the checks above.
- [ ] **App stores.** Not started.

## Deploy note

Git production for `main` is already on Vercel. This pass did not call `create_deployment` again and did not change project protection. `list_projects` with `search=never86` returned an empty page; the project is visible without that search. `vercel` CLI is not installed here and no `VERCEL_TOKEN` is in the environment.
