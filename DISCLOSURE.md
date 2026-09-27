# Stack & integrations disclosure — Never86 X clean build

## In use now (Verified)
- **Cursor** agent tools (Shell, file edit, computerUse for mirror screenshots)
- **Grok Bot / Main Bot** orchestration on this machine
- **Next.js 15** + React + TypeScript + Tailwind CSS
- **Source of truth UI:** live https://app.never86.app mirrored via `/mirror/screenshots` + `docs/SCREEN-MAP.md` + `docs/STRUCTURE-MAP.md`
- Honesty labels: Verified / Estimated / Missing / Sample — **never invent dollars**

## Free checks (this branch)
- Invoice, plate, and labor math run in the browser. Files are not posted to an API.
- PDF text uses pdf.js on the device. Photos use tesseract.js, loaded only after a photo is chosen. A photo price is Estimated, never Verified. Confidence under 40% shows no dollar. The picture is not uploaded. The reader files are copied locally on install.
- Sample figures are the public walkthrough numbers (mozzarella $48 → $56, plate $4, labor $31 from the $20 and $18 rates).
- Price comparison idea from `never86d-beta-ctap` (`getInvoicePriceComparison`) was reimplemented for two pasted invoices. The database function was not copied.
- "No dollar unless both numbers are on the paper" follows the rule in `polar-reef-scarlet-crisp` `parseInvoice`, not the Iowa liquor parser.
- "No labor dollars without a rate on the paper" follows `never86` `docs/COMMAND_DRILLDOWN.md`.

## Not in use / not claimed
- **No SpaceX-derived APIs or hardware** are available or wired. None were invented.
- **No CTO build** code copied into this tree
- **No existing Never86 GitHub account or repo** was modified
- **GitHub CLI:** not logged in — cannot create account or remote repo without Myke
- **xAI / Grok plugins inside the app:** Pending (not wired in this scaffold)
- **Auth / lifecycle email / health checks / paid seats 2–3:** Pending

## To finish remote publish (needs Myke)
1. Create new GitHub account (Myke email + verify) — or Yes + email for assisted signup
2. `gh auth login` on this machine for that account only
3. Create empty public/private repo and push this tree
4. Wire Never86 X auth (not OpenAI wall as product home)

## Spec locked (not live wiring yet)
- Camera → OCR/vision extract → Verified/Estimated/Missing → one-tap Confirm — see `docs/CAPTURE-EXTRACT-PIPELINE.md`
- Agent Drive / local / email ingest — see `docs/AGENT-INGESTION.md`
- Sample extract only in `docs/samples/invoice-extract-mozz.sample.json` — not a live OCR claim
