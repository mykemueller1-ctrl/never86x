# Never86 / Action Shift — live public walkthrough map

Captured read-only from `https://app.never86.app` on 2026-09-23/24. Screenshots are in `screenshots/`.

## Screenshot index

| File | Screen / route | What it does | Visible nav / CTAs / notes |
|---|---|---|---|
| 01-home.png | Home `/` | Landing page for restaurant cost checks. | Header: NEVER86’D / ACTION SHIFT; `Sign in`. CTAs: `Explore the owner desk`, `Check my invoices`, `Try the example`, `Check my labor`, `See example`, `Check my plate cost`, `See example`, `Watch the walkthrough`, `Talk to Myke`; footer `Privacy`, `Email data`. Copy includes “A SECOND SET OF EYES FOR YOUR RESTAURANT”, “You run the restaurant. Let’s watch the costs.” |
| 02-login-auth-wall.png | Sign-in link → `https://auth.openai.com/log-in` | Authentication wall reached from the app’s `/seat` sign-in link; no credentials entered. | Visible options: email address + Continue, Google, Apple, Microsoft, phone; Sign up. No X option observed. This is an OpenAI-branded auth page, not an in-app Never86 form. |
| 03-owner-desk.png | Owner desk sample `/try/desk` | Read-only sample owner workspace. | Sidebar nav: `Owner desk`, `Invoice prices`, `Labor & schedules`, `Menu & plate cost`, `What’s missing` (`/seat?start=data`), `My actions` (`/seat?start=actions`). CTAs: `Add my records`/`Open my private workspace` (auth), `See the math and source` (`/try`), `Watch the walkthrough`. Sample folders: Schedule, Time-clock report, Invoices & credits, Prime-cost review, Follow-through. |
| 04-invoice-prices.png | `/try/desk` with `Invoice prices` selected | Invoice-focused owner-desk state; sample content remains invoice check. | Active sidebar state is `Invoice prices`; main finding: “Same case. An $8 price increase.” |
| 05-labor-schedules.png | `/try/desk` with `Labor & schedules` selected | Labor-focused owner-desk state. | Main finding: “Start with planned and actual hours.” Next action: “Open the labor example to compare the shifts and their evidence.” |
| 06-menu-plate-cost.png | `/try/desk` with `Menu & plate cost` selected | Menu/plate-cost owner-desk state. | Main finding: “Know the cost behind one plate.” Next action: “Open the recipe example to check ingredient costs and portions.” |
| 07-try.png | One Seat start `/try` | Starts the invoice sample walkthrough. | Progress: Invoices → Menu → Sales → Morning. CTA disabled until restaurant name: `Check my invoices`; public sample CTA: `Just show me with a sample restaurant`; `Watch`. Labels: `DEMO · SAMPLE DATA`, `Saved on this browser`, `Fictional documents. Real calculations.` |
| 08-try-labor-01-plan.png | Labor walkthrough `/try/labor` step 01 | Shows sample schedule before comparing labor hours. | `Read sample schedule` (primary), `See the schedule`, `Start over`. Copy: “Scheduled until 9. Who stayed until 11?”; `DEMO · SAMPLE DATA`; fictional staff/report disclaimer. |
| 09-try-labor-schedule-dialog.png | `/try/labor` sample schedule dialog | Read-only modal with schedule facts. | `Sample schedule`; Corner Table fictional restaurant; Sep 11, 2026; Alex and Jordan rows with in/out, unpaid break, and rates; `Close`. |
| 10-try-labor-clock-report.png | `/try/labor` step 02 | Shows planned shifts before clock-report comparison. | `Compare sample clock report` (primary), `See clock report`, `Start over`. Copy: “Now add the clock report.” |
| 11-try-recipes.png | Recipe walkthrough `/try/recipes` | Shows a sample recipe/plate cost breakdown. | `Use my recipe card`, `Explore the sample workspace`, `Copy example link`; expandable `Adjust the recipe`, `See every price and conversion`. Copy: “Every ingredient. One honest plate cost.” |
| 12-try-watch.png | Customer walkthrough `/try/watch` | Video-led product walkthrough and sample invoice comparison. | `Check my invoices`, `Try the sample first`, downloadable full/vertical video links, expandable `About the examples and calculations`. Copy includes “Same cheese. Same case. Different price.” and “First owner seat free. No card required.” |
| 13-contact.png | Contact `/contact` | Contact-request form for help getting started. | Email field; `Yes, contact me`; `I’ll try a free check first →`. Honesty note: “This sends only your contact request. It does not connect your inbox or share restaurant files.” |
| 14-privacy.png | Privacy `/privacy` | Privacy/data-handling policy. | Sections: Information we use; Optional email connection; Processing and sharing; Google data and Limited Use; Storage and your choices; Browser storage. Brand/legal title: “Privacy and your restaurant records”. |
| 15-email-data.png | Email data `/email-data` | Explains email-report collection, retention, AI review, pausing/disconnect, and services involved. | `Back to Email & reports`; sections include `You choose what to collect`, `What is retained`, `Review and AI`, `Pause and disconnect`, `Services involved`. |

## IA / route notes

- `/` is the public landing page.
- `/try/desk` is the public sample owner desk with in-page states for invoice, labor, and menu/plate cost.
- `/try` is the public One Seat invoice walkthrough start.
- `/try/labor` is the public labor walkthrough; captured plan state, schedule modal, and clock-report state.
- `/try/recipes` is the public recipe-card walkthrough.
- `/try/watch` is the public video/customer walkthrough.
- `/contact`, `/privacy`, and `/email-data` are public informational/form pages.
- `/seat`, `/seat?start=data`, and `/seat?start=actions` are linked as the private workspace / missing-data / actions paths. Following the app’s `Sign in` link reached the auth wall at `auth.openai.com/log-in`; no credentials were attempted. No private workspace screens were captured.
- No separate public pricing, seats, papers, invoices, labor, menu, checks, onboard, operator, or purchase screen was reachable without the auth wall; public examples are represented by the routes above.

## Exact brand / honesty strings observed

- `NEVER86’D`
- `Never86’d`
- `Never86’d Action Shift`
- `ACTION SHIFT`
- `One Seat`
- `One Seat by Never86’d`
- `DEMO · SAMPLE DATA`
- `SAMPLE DATA`
- `Fictional documents. Real calculations.`
- `Fictional staff and reports. Real uploads stay in your private seat.`
- `This walkthrough uses sample documents. Your name personalizes the demo.`
- `No card required`
- `No POS connection to start`
- `Originals kept with your check`
- `Your first owner seat is free`
- `First owner seat free. No card required.`
- `Saved on this browser`
- `Sample progress saved on this browser`
- `Your private workspace retains originals, reviewed facts and follow-ups.`
- `This sends only your contact request. It does not connect your inbox or share restaurant files.`

No pricing amount or paid-seat pricing screen was shown; no dollars were invented. Sample values visible in public examples include the invoice comparison `$48.00 → $56.00` / `+$8.00 per case`, recipe ingredient cost `$4.00`, and labor sample rates `$20/h` and `$18/h`.
