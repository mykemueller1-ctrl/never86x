# Signed-out route table

Before is live `https://app.never86.app` on Sat Sep 26, 2026 (`curl -sI`). Those four checks answer `307` to `/signin-with-chatgpt`, which sends the visitor to an OpenAI login.

After is this branch on a local Next server. Every row is `200`. No `Location` header.

| Route | Before (live) | After (this branch) |
|---|---|---|
| `/` | 200 | 200 |
| `/try` | 200 | 200 |
| `/try/watch` | 200 | 200 |
| `/try/recipes` | 200 | 200 |
| `/try/labor` | 200 | 200 |
| `/try/desk` | 200 | 200 |
| `/check/invoices` | 307 → `/signin-with-chatgpt?return_to=/check/invoices` | 200, paste two invoices, no login |
| `/check/menu` | 307 → `/signin-with-chatgpt?return_to=/check/menu` | 200, paste a recipe, no login |
| `/check/labor` | 307 → `/signin-with-chatgpt?return_to=/check/labor` | 200, paste schedule and clock, no login |
| `/seat` | 307 → `/signin-with-chatgpt?return_to=/seat` | 200, history on this phone |
| `/seat?start=data` | (same seat wall) | 200 |
| `/seat?start=actions` | (same seat wall) | 200 |
| `/pricing` | not the live app path | 200, seat 1 is the word Free |
| `/onboarding` | not the live app path | 200 |
| `/contact` | 200 on the live app | 200, does not pretend to send email |
| `/support` | not the live app path | 200 |
| `/status` | not the live app path | 200 |
| `/privacy` | 200 on the live app | 200 |
| `/terms` | not the live app path | 200 |
| `/email-data` | 200 on the live app | 200, mailbox is Missing |
| `/admin` | not linked in the public nav | 200 stub |
| `/api/health` | not the live app path | 200 |
| `/opengraph-image` | n/a | 200 image |
| `/check/invoices/opengraph-image` | n/a | 200 image |
| `/check/menu/opengraph-image` | n/a | 200 image |
| `/check/labor/opengraph-image` | n/a | 200 image |
| `/seat/opengraph-image` | n/a | 200 image |

Walkthrough film, linked from `/try/watch`: `https://app.never86.app/media/never86-landscape-v24.mp4` returned 200 on the same day. This branch does not change that host.
