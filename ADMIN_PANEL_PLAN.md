# SomStudioPhotography - Admin Panel Plan

Phase 4 planning document for the internal admin panel. Authentication,
dashboard, and CRUD for services/packages/portfolio/inquiries are now
implemented — see the status lines under each phase below. Testimonials
and Settings CRUD remain unbuilt (Phase 4F/4H), and the shop/payments
phase (4I) is intentionally out of scope for now.

## Proposed Admin Routes

- `/admin`
- `/admin/login`
- `/admin/services`
- `/admin/packages`
- `/admin/portfolio`
- `/admin/testimonials`
- `/admin/inquiries`
- `/admin/settings`

## Phase Breakdown

### Phase 4A: Admin planning

- Create this document
- Decide route structure
- Decide auth approach
- No code functionality yet

### Phase 4B: Admin authentication foundation

- Status: completed

- `AdminUser` model exists, passwords hashed with bcrypt
- Custom HMAC-signed, httpOnly, sameSite session cookie (see "Auth Decision" below)
- Every `/admin/*` page calls `requireAdmin()`; every mutating server action
  also calls `requireAdmin()` independently (not just the page it's rendered on)
- Production refuses to boot without `ADMIN_SESSION_SECRET` set (no insecure fallback)

### Phase 4C: Admin dashboard shell

- Status: completed

- `/admin`
- Sidebar layout
- Topbar
- Summary cards now backed by real database stats (inquiries by status, services, packages, portfolio categories/images, testimonials)
- Recent inquiries list with links to `/admin/inquiries/[id]`
- Quick links to Services/Packages/Portfolio/Inquiries
- No CRUD on this page itself

### Phase 4D: Services CRUD

- Phase 4D-1 (list-only): Status: completed
- Phase 4D-2 (service detail, read-only): Status: completed
- Phase 4D-3 (service edit): Status: completed
- Phase 4D-4 (service create): Status: completed
- Phase 4D-5 (packages list, read-only): Status: completed
- Phase 4D-6 (package detail, read-only): Status: completed
- Phase 4D-7 (package edit): Status: completed
- Phase 4D-8 (package create): Status: completed

- List services
- Create service
- Edit service
- Activate/deactivate service
- Display order
- Manage highlights
- Manage packages later

### Phase 4E: Portfolio management

- Phase 4E-1 (portfolio categories list, read-only): Status: completed
- Phase 4E-2 (portfolio category detail, read-only): Status: completed
- Phase 4E-3 (portfolio category edit): Status: completed
- Phase 4E-4 (portfolio category create): Status: completed
- Phase 4E-5 (portfolio images list, read-only): Status: completed
- Phase 4E-6 (portfolio image detail, read-only): Status: completed
- Phase 4E-7 (portfolio image create, imageUrl field only): Status: completed
- Phase 4E-8 (portfolio image edit, imageUrl field only): Status: completed
- Phase 4E-9 (portfolio image upload/storage via Cloudinary, manual imageUrl kept as fallback): Status: completed

- Portfolio categories
- Portfolio images
- Featured images
- Ordering

### Phase 4F: Testimonials management

- Add/edit/delete testimonials
- Feature/unfeature reviews
- Active/inactive status

### Phase 4G: Inquiries

- Phase 4G-1 (public contact form saves to database, service inquiry buttons prefill): Status: completed
- Phase 4G-2 (inquiries list, read-only): Status: completed
- Phase 4G-3 (inquiry detail with status/notes update): Status: completed
- Phase 4G-4 (email notification on new inquiry via Resend, with client auto-reply; fails gracefully if unconfigured): Status: completed

- Contact form submissions later
- Status management
- Notes
- WhatsApp/email follow-up

### Phase 4H: Settings

- Contact details
- Social links
- Business hours
- Homepage text/images later

### Phase 4I: Packages/shop later

- Packages
- Service selling
- Orders
- Payments later

### Phase 4J: Production readiness QA pass

- Status: completed

- Added `requireAdmin()` to every mutating admin server action (previously only the pages checked auth, not the actions themselves)
- Fixed public inquiry form's service dropdown to read from the database instead of a static hardcoded list, so admin-created services now appear and prefill correctly from "Book Now"
- Documented `NEXT_PUBLIC_SITE_URL` in `.env.example` (used for canonical URLs and the inquiry-notification admin link)
- Corrected stale "started" statuses in this document for Phase 4B and 4D-1/4D-2/4D-3
- Verified `npx next build` succeeds cleanly
- Added `DEPLOYMENT_CHECKLIST.md`

## Admin Safety Rules

- Never expose admin pages without authentication.
- Never store plain-text passwords.
- Never commit `.env`.
- Image upload storage choice was finalized as Cloudinary (Phase 4E-9), with manual Image URL kept as a fallback.
- Do not build payment until orders/packages flow is stable.
- Keep the public website stable while admin is added gradually.
- Make small commits per admin phase.

## Auth Decision (made)

Custom session-based admin auth was chosen over Auth.js/NextAuth, since
this app has a single internal admin surface with no external providers
needed. Implemented as an HMAC-signed session token (`src/lib/auth/session.ts`)
in an httpOnly, sameSite=lax, secure-in-production cookie, verified on
every admin page and every mutating server action via `requireAdmin()`
(`src/lib/auth/admin.ts`).

## First Admin Feature Recommendation

1. Admin authentication foundation
2. Admin dashboard shell
3. Services CRUD first
