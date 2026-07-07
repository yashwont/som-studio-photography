# SomStudioPhotography — Project Roadmap

Planning document for phased build-out of the SomStudioPhotography website.
Stack: Next.js (App Router, root `app/`), TypeScript, Tailwind CSS.

Last audited: 2026-07-07.
Last cleaned: 2026-07-07 (Process section + files removed, `/book` deferred).
Phase 2 content planning started: 2026-07-07 — see `CONTENT_MODEL_PLAN.md`.

## Phase 1: Public website cleanup

- [x] Confirm clean routes — root `app/` routing in use, no `src/app`.
- [x] Process page removed — no `/process` route exists, and it will not be
      recreated.
- [x] Homepage Process section removed — `app/page.tsx` no longer imports or
      renders the "Our photoshoot process" section. `Process.tsx` and
      `process.ts` were deleted as they had no other usage.
- [x] Booking page deferred — `/book` and `BookingForm` were removed. All
      "Book Now" / "Book a Session" / service-card booking links now go to
      `/contact`. A real `/book` page will be built later once a booking
      system (data storage, admin status updates) is ready — see Phase 7.
- [x] Public website pages are exactly the six intended routes: `/`,
      `/about`, `/services`, `/portfolio`, `/testimonials`, `/contact`
      (plus dynamic portfolio detail routes under `/portfolio/[work]`).
- [x] Confirm homepage structure — Hero, About, Services, PortfolioPreview,
      Testimonials, FinalCTA. No embedded contact form.
- [x] Confirm navigation — navbar/footer link only to the six public pages;
      no `/process` or `/book` link anywhere.
- [x] Confirm SEO basics — per-page `metadata`, `sitemap.ts`, `robots.ts` in
      place; `sitemap.ts` (`siteRoutes`) lists only the six public pages,
      no `/process`, no `/book`.
- [ ] Replace placeholder images with real studio/portfolio photography.

## Phase 2: Content structure preparation

- [x] Audited all six files in `src/data` (`services`, `portfolio`,
      `testimonials`, `contact`, `navigation`, `visuals`).
- [x] Decided what content stays static vs. what moves to admin/database —
      see `CONTENT_MODEL_PLAN.md` sections A and B.
- [x] Prepared full future model field lists (`Service`, `Package`,
      `PortfolioCategory`, `PortfolioImage`, `Testimonial`, `Inquiry`,
      `Booking`, `Order`, `Payment`, `AdminUser`, `SiteSettings`) mapped
      against current data shapes — see `CONTENT_MODEL_PLAN.md` section C.
- [x] Removed `src/components/sections/HomeProof.tsx` (confirmed unused
      after the Phase 1 homepage reorder).
- [ ] Decide `PortfolioImage` shape: one row per gallery image vs. keeping
      a gallery array (see open question in `CONTENT_MODEL_PLAN.md`).
- [ ] Decide whether `Testimonial.role` is kept or dropped in the future
      model (not in the originally suggested field list).

## Phase 3: Database setup (later)

- Suggested database: PostgreSQL
- Suggested ORM: Prisma
- Do not install yet.

## Phase 4: Admin panel (later)

- Admin login
- Dashboard
- Manage services
- Manage portfolio images
- Manage testimonials
- Manage contact/inquiries
- Manage site settings

## Phase 5: Image management (later)

- Suggested storage: Cloudinary or Supabase Storage
- Portfolio categories
- Image upload
- Image ordering
- Featured image selection

## Phase 6: Services/packages/shop (later)

- Services page
- Packages
- Add-to-cart or inquiry-based selling
- Orders
- Payment status

## Phase 7: Booking/inquiry management (later)

- Contact inquiries
- Booking request (service, preferred date, due date, message)
- Date/time preference
- Admin status update
- Email/WhatsApp follow-up
- A real `/book` page is deferred until this phase — build it once bookings
  are actually persisted (database + admin status updates), rather than as
  a client-only WhatsApp/email form. Until then, all booking CTAs point to
  `/contact`.

## Suggested future database models

- `Service`
- `Package`
- `PortfolioCategory`
- `PortfolioImage`
- `Testimonial`
- `Inquiry`
- `Booking`
- `AdminUser`
- `Order`
- `Payment`
- `SiteSettings`

## Resolved items from the 2026-07-07 audit (cleaned this session)

1. **Process removed.** `Process.tsx`, `process.ts`, and the unused
   `ProcessStep` type were deleted. The homepage no longer renders the
   "Our photoshoot process" section. No `/process` route exists or will be
   recreated.
2. **`/book` removed for now.** `app/book/page.tsx` and
   `BookingForm.tsx` were deleted. All booking CTAs (nav "Book a Session",
   service-card "Book Now") now point to `/contact`. A real booking page
   will be rebuilt in Phase 7 once there is a backend to persist requests.
3. **`src/components/sections/Contact.tsx` removed.** It was unused dead
   code — `/contact` builds its layout directly with `InquiryForm` instead.

4. **`HomeProof.tsx` removed.** It became unused once the Phase 1 homepage
   reorder dropped it in favor of `Services`/`Testimonials`; deleted in
   Phase 2.
