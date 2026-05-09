# ASIVANTA AI Chat Checklist

Last updated: 2026-05-09

## Completed

- [x] Located current floating chat UI: `artifacts/asivanta/src/components/TelegramChatButton.tsx`
- [x] Confirmed there was no existing `/api/ai/chat` endpoint in this repo
- [x] Checked local AI bridge at `http://localhost:8787`; it reports `gemma4:e4b` and protected chat access
- [x] Added ASIVANTA-specific assistant personality file: `api/ai/asivanta-assistant.md`
- [x] Added backend AI wrapper and fallback endpoint: `api/ai/chat.js`
- [x] Added site map, safe answer rules, and ASIVANTA page routing guidance
- [x] Replaced the floating Telegram-only button with an on-site assistant UI
- [x] Frontend now sends current page/path, page title, and recent chat history
- [x] Backend avoids PupCare language and falls back when the bridge is slow, unauthorized, or offline

## Pages The Assistant Should Know

- [x] `/` home, services, methodology, industries
- [x] `/contact` sourcing review
- [x] `/instant-quote` Quote Now RFQ, BOM, spec upload, guided component builder, part-list builder
- [x] `/insights` articles
- [x] `/about` firm background and buyer-side model
- [x] `/portal` client portal preview
- [x] `/login` client portal login
- [x] `/privacy` and `/terms`

## Test Items

- [x] Local frontend chat bubble opens on desktop
- [x] Local frontend chat bubble opens on mobile width
- [x] Local `/api/ai/chat` returns a useful ASIVANTA answer
- [x] Local production build passes with `PORT=5173 BASE_PATH=/`
- [x] Production `/api/ai/chat` returns a useful ASIVANTA answer
- [x] Production chat bubble sends page/path and displays links

## Future Admin Backend Notes

- [ ] Add chat lead capture when visitor asks for human help
- [ ] Log anonymized chat questions into the future admin dashboard
- [ ] Add escalation from chat to Quote Now or contact form with prefilled context
