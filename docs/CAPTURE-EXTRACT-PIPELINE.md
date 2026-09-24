# Never86 X — Camera-first capture + extract pipeline

**Locked:** Wed Sep 23, 2026 voice call  
**Rule:** Operators do **not** type invoices. Phone camera + email + files on the computer. UX = “like a toddler”: big buttons, guided prompts, one-tap confirm.

## Pipeline (happy path)

```
Camera / email / local file
        ↓
Preprocess (deskew, contrast, glare reduce) — Estimated until live bench
        ↓
Vision OCR + line-item AI (structured JSON schema)
        ↓
Confidence scorer → honesty badge
        ↓
Ticket on the rail (needs review)
        ↓
One-tap Confirm → Verified  |  Fix field → re-score  |  Reject → Missing
```

### Honesty mapping (already on sample desk)
| Score | Badge | Meaning |
|-------|-------|---------|
| High field confidence + operator tap Confirm | **Verified** | Safe to use in price drift / P&L |
| Model output, no Confirm yet OR mid confidence | **Estimated** | Shown on rail; never silent invent |
| Blank / unreadable / not found | **Missing** | Empty cell — never filled with a guess |

**Never invent dollars.** If the photo can’t read tax or a line price, that field stays Missing.

## Capture surfaces (no typing)

1. **Phone camera (primary)** — Big “Snap the ticket” button. `accept="image/*" capture="environment"`. Heavy use: low light, crumpled paper, thumb over corner, delivery tickets on stainless. Multi-shot allowed (front + back).
2. **Email (background)** — After Google allow-access: scan inbox for vendor invoices, statements, order confirmations. Hits land on the ticket rail as Estimated until one-tap Confirm.
3. **Computer files** — Operator points once at a folder (or agent finds via Drive — see `AGENT-INGESTION.md`). PDF + photo of packing slips.

## Models / tools (wiring — design lock)

| Stage | Tool | Status |
|-------|------|--------|
| Camera input | Mobile web file picker + later PWA / native wrapper | Spec locked; UI stub next |
| Image preprocess | OpenCV-style deskew/contrast **or** model-side only | Pending bench |
| Document OCR + extract | **Vision LLM** with strict JSON schema (vendor, date, invoice #, line items, subtotal, tax, total, currency) — primary path using the stack already on Never86 (OpenAI-compatible / Grok vision when wired). Fallback: Google Document AI or AWS Textract if vision fails on crumpled/low-light | **Pending** live key wire; sample extract below is **Sample** |
| Email ingest | Existing Papers / Gmail Connect pattern (Google OAuth) + MIME/PDF/attachment pull | Auth Pending until Yes |
| Local / Drive files | See `AGENT-INGESTION.md` | Spec locked |
| Confidence | Per-field score from model + checksum (sum lines ≈ total) | Spec locked |
| UI confirm | One tap “Looks right” → Verified; field chips for fix | Spec locked |

No operator keyboard for line items. Fixes = tap a yellow Estimated chip → speak or pick from suggestions, not a spreadsheet.

## What gets extracted (schema)

```json
{
  "honesty": "Estimated",
  "source": "camera|email|drive|local",
  "vendor": { "name": "", "confidence": 0 },
  "invoiceDate": { "value": "YYYY-MM-DD", "confidence": 0 },
  "invoiceNumber": { "value": "", "confidence": 0 },
  "currency": "USD",
  "lineItems": [
    { "sku": "", "description": "", "qty": 0, "unit": "", "unitPrice": null, "extPrice": null, "confidence": 0, "honesty": "Estimated|Missing" }
  ],
  "subtotal": null,
  "tax": null,
  "total": null,
  "checksumOk": false,
  "railTicket": "price-drift|receiving|needs-review"
}
```

## Sample: photographed mozzarella invoice → after extract

**Source photo (Sample):** crumpled Sysco-style delivery ticket, kitchen light, same 20 lb mozzarella case as the desk demo.

See `/workspace/never86x-clean/docs/samples/invoice-extract-mozz.sample.json` and the typed object in `src/lib/sample.ts` (`SAMPLE_INVOICE_EXTRACT`).

Rail card the operator sees:
- Vendor: **Sysco** · Estimated  
- Date: **2026-09-18** · Estimated  
- Lines: Mozzarella 20 lb case × 1 @ **$56.00** · Estimated  
- Tax: **Missing** (unreadable crease)  
- Total: **$56.00** · Estimated · checksum partial  
- Big buttons: **Looks right** | **Retake photo** | **Not my ticket**

After **Looks right** → fields flip to Verified; price-drift ticket vs prior $48 Sample case fires on the rail.

## Toddler UX copy (bake in)
- “Point your phone at the paper.”
- “Got it — check this one thing.”
- “Looks right?” (one tap)
- Never: “Upload CSV”, “Map columns”, “Configure AP workflow”.
