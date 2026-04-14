# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## ASIVANTA Landing Page

Premium landing page for ASIVANTA — a Korea-based sourcing and supply chain advisory firm.

### Features
- 10-section single-page landing with smooth scroll animations (framer-motion)
- Sticky navbar with scroll-aware styling (transparent on hero, white on scroll)
- Mobile responsive with hamburger menu
- Premium service cards, 4-step methodology section, industry grid
- Client Portal "coming soon" teaser with abstract UI mockup
- Insights/resources section with article and video placeholders
- Strong CTA sections with "Book a Call" and "Contact Us" buttons
- Footer with company info, navigation, and social links

### Routing
- `/` — Home/landing page (10 sections)
- `/portal` — Client Portal dashboard
- `/login` — Login page
- `/insights` — Insights articles with modals
- `/contact` — Functional contact form with file uploads
- `/about` — About page
- `/admin` — Internal submissions viewer (no auth yet)

### Contact Form System
- Frontend: Full validation, file upload (PDF/XLSX/PNG/JPG, max 2 files, 8MB), honeypot, rate limiting
- Backend API: `POST /api/contact` — validates, stores to PostgreSQL, sends email via Resend, logs to disk
- Submissions API: `GET /api/submissions` (list), `GET /api/submissions/:id` (detail)
- Admin page at `/admin` — table view with click-to-expand detail modal
- Database: `contact_submissions` table via Drizzle ORM
- Email: Requires `RESEND_API_KEY` secret; submissions save regardless of email status

### Key Files
- `artifacts/asivanta/src/pages/home.tsx` — Main landing page with all sections
- `artifacts/asivanta/src/pages/contact.tsx` — Contact form
- `artifacts/asivanta/src/pages/admin.tsx` — Submissions admin viewer
- `artifacts/asivanta/src/components/layout/navbar.tsx` — Sticky navigation
- `artifacts/asivanta/src/components/layout/footer.tsx` — Footer component
- `artifacts/api-server/src/routes/contact.ts` — Contact form API with validation/email
- `artifacts/api-server/src/routes/submissions.ts` — Submissions list/detail API
- `lib/db/src/schema/contact-submissions.ts` — Database schema for submissions
- `artifacts/asivanta/src/assets/logo-new-transparent.png` — Logo with transparent background

### Design System
- Color palette: Deep slate (#0a1128), steel-blue accents, white backgrounds
- Typography: Inter (sans-serif)
- Animations: framer-motion scroll-triggered reveals, parallax hero
- Icons: lucide-react
