# Incident response — Never86 X

1. **Detect** — `/api/health`, Vercel runtime logs, customer email.
2. **Triage** — Sev1 = data loss / wrong money shown; Sev2 = auth down; Sev3 = cosmetic.
3. **Contain** — Rollback Vercel production deployment; disable checkout env if billing misfires.
4. **Communicate** — Update `/status` honesty labels; email `NEXT_PUBLIC_SUPPORT_EMAIL` list if any.
5. **Fix** — PR with root cause; never invent dollar figures in hotfixes.
6. **Review** — Postmortem within 72h for Sev1/2.

External status page / PagerDuty: **Missing** until accounts exist.
