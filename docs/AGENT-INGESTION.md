# Never86 X — Agent file / Drive / email ingestion

**Locked:** Wed Sep 23, 2026 voice call  
**Goal:** Grok or Cursor (or equivalent agent) goes into the operator’s back-office files and cloud drives, finds ops docs, and folds them into One Seat — **no manual upload ballet**.

## Priority order
1. **Google Drive** (via existing Google sign-in + “Allow access” prompt)
2. **Local computer folder** the operator points at **once**
3. **Email** (inbox scan — invoices/statements/order confirmations; also SOP/menu attachments)

## Auth
- Prefer **Google OAuth** already used for Papers / seat: scopes for Drive read + Gmail readonly when Yes’d.
- Local files: one folder picker (or agent on the registered computer with Myke/operator approval). No silent full-disk scrape.
- Cloud siblings (Dropbox/OneDrive): later; same “Allow access” pattern.

## Agent approach
1. Operator taps **Find my papers** (big button).
2. Agent searches Drive (and optional local root) for names/types: `SOP`, `menu`, `recipe`, `vendor`, `price list`, `par`, `ordering`, `.xlsx`, `.pdf`, Google Docs/Sheets.
3. Rank by freshness + name match; show 3–5 **Found these** cards (Estimated).
4. One-tap **Use this** per file → parse → map → rail.
5. Background watch: new Drive invoice PDFs / email attachments → ticket rail.

## Auto-map from typical files

| Source file | Auto-maps into |
|-------------|----------------|
| **Menu PDF / Doc / photo** | Menu items → plate-cost rows; modifiers Estimated until recipe linked |
| **Recipe / costing sheet** | Ingredients + yields → plate cost; Missing where units unclear |
| **Vendor list / contacts** | Vendor master for invoice matching (name aliases) |
| **Price list / bid sheet** | Expected unit prices → drift baseline (Estimated until invoice Confirm) |
| **SOP (opening, closing, receiving)** | Guided workflow steps on the rail (“Receiving checklist”) — not a wiki dump |
| **Par / order guide** | 86-list / walk-in coverage hints |
| **Email invoice PDF** | Same extract schema as camera (`CAPTURE-EXTRACT-PIPELINE.md`) |

## What we do **not** do
- Invent missing recipe costs or vendor prices.
- Overwrite Verified fields with a quieter Estimated Drive parse.
- Require the operator to understand folders, CSV mapping, or “data rooms”.

## Status
- Spec locked in clean build docs.
- Live Drive/Gmail scopes + agent runner = **Pending** auth Yes (same as Papers Connect).
- Sample desk still Sample mozzarella until first real Confirm.
