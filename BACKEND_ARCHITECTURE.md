# SomStudioPhotography — Backend Architecture Plan

Phase 3A planning document: the recommended **local development** backend
direction for SomStudioPhotography. This document plans architecture only —
no packages are installed, no database is connected, and no application
code changes in this phase.

Deployment (Vercel, VPS, Docker, hosting, Nginx, SSL, production config) is
explicitly out of scope for this document and for Phase 3 in general. It
will be planned separately, later, once the backend itself exists and works
locally.

Last updated: 2026-07-07.

## Recommended local stack

- **Database:** PostgreSQL
- **ORM:** Prisma
- **Image/media storage (later):** Cloudinary, or local placeholder images
  first
- **Auth (later):** Auth.js / NextAuth, or a secure custom admin auth flow
- **Admin panel:** custom `/admin` routes inside the same Next.js app (no
  separate service/repo)
- **Public website:** the existing six public pages stay exactly as they
  are — the backend is added around them, not instead of them

## Why this stack

**PostgreSQL** — the future content models already sketched in
`CONTENT_MODEL_PLAN.md` (`Service`, `Package`, `PortfolioCategory`,
`PortfolioImage`, `Testimonial`, `Inquiry`, `Booking`, `Order`, `Payment`)
are relational: services have many packages, portfolio images belong to
categories, bookings reference inquiries and services, orders reference
payments. That's a foreign-key-and-join shape, which is what a relational
database is for. PostgreSQL specifically is free, widely supported, has
solid JSON column support for anything semi-structured (e.g. package
inclusions lists), and is the default pairing for Prisma in the Next.js
ecosystem — no unusual tooling required.

**Prisma** — gives type-safe database access generated directly from the
schema, so a `Service` read in a Server Component or API route is typed
without hand-written interfaces drifting out of sync with the database.
It also gives migrations (`prisma migrate`) as a first-class, versioned,
reviewable set of SQL changes, instead of hand-run ALTER TABLE statements.
Since this project is already all-TypeScript, Prisma's generated client
fits directly into the existing `src/types/site.ts`-style typing habit
instead of fighting it.

**Cloudinary or similar media storage (later)** — portfolio and service
images are the highest-volume, highest-churn content the admin will
manage. Storing many uploaded images directly inside the Next.js app
(e.g. in `public/`) doesn't scale operationally: every new image would
need a code change and redeploy, `public/` isn't meant to be a
runtime-writable store, and there's no built-in resizing/CDN delivery.
Offloading to Cloudinary (or an equivalent object store) up front avoids
a painful re-platforming later, once there are dozens of portfolio
images. Until that's wired up, portfolio/service images can keep using
local placeholder files exactly as `src/data/visuals.ts` and
`src/data/portfolio.ts` do today.

**Admin panel after the schema is stable** — building `/admin` CRUD
screens against a schema that's still changing means rebuilding those
screens every time a field is renamed or a relation changes. Locking the
schema first (Phase 3C), seeding it with the current static content
(Phase 3D), and only then building admin screens against it (Phase 4)
means each admin screen is built once, against its final shape.

**Shop/payment after services and packages are admin-manageable** — an
inquiry-based "shop" only makes sense once an admin can actually create
and edit the packages being sold. Building checkout/payment before that
would mean hardcoding the exact products it's supposed to make editable.
Payment integration is pushed even further out, since it's the highest-
risk, hardest-to-reverse piece (real money, external provider, compliance
surface) and should only be built against a stable Order model.

## Proposed backend phases

### Phase 3A: Backend architecture planning
- Create this document
- Decide local backend direction
- No code changes to app functionality

### Phase 3B: Prisma/PostgreSQL setup
- Install Prisma later
- Create local `.env`
- Create Prisma schema
- Connect local PostgreSQL database

### Phase 3C: Database schema
- Add models:
  - `Service`
  - `Package`
  - `PortfolioCategory`
  - `PortfolioImage`
  - `Testimonial`
  - `Inquiry`
  - `Booking`
  - `Order`
  - `Payment`
  - `AdminUser`
  - `SiteSetting`

### Phase 3D: Seed data
- Convert current `src/data` content into seed data
- Keep public website working during migration

### Phase 4: Admin panel
- `/admin`
- `/admin/services`
- `/admin/portfolio`
- `/admin/testimonials`
- `/admin/inquiries`
- `/admin/settings`

### Phase 5: Image management
- Upload portfolio images
- Manage categories
- Manage featured images
- Reorder images

### Phase 6: Shop/services selling
- Packages
- Service package listing
- Inquiry-based purchase first
- Orders later

### Phase 7: Booking and payment
- Booking requests
- Admin approval
- Payment status
- Payment integration later

## Rules for next development steps

- Do not add deployment yet.
- Do not add payment yet.
- Do not add admin before database schema.
- Do not add image upload before storage decision.
- Keep the public website stable while backend is added gradually.
- Keep changes small and commit after each phase.
