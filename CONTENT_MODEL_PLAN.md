# SomStudioPhotography — Content Model Plan

Phase 2 planning document: what content is static for now, what should
later be admin-managed, and the future database model shapes to build
toward. No database, ORM, or backend is added in this phase — this is
planning only.

Last updated: 2026-07-07.

## Current data files in `src/data`

| File | Exports | Notes |
| --- | --- | --- |
| `services.ts` | `services`, `featuredServices` | 10 services, flat pricing, no packages/tiers yet |
| `portfolio.ts` | `portfolioCategories`, `portfolioWorks` | 10 categories, 14 works, each work has one hero image + gallery array |
| `testimonials.ts` | `testimonials` | 6 client reviews, all rating 5 |
| `contact.ts` | `contactInfo` | phone, whatsapp, email, address, map URL, social links, business hours |
| `navigation.ts` | `navLinks`, `ctaLink` | the six nav links + the "Book a Session" CTA target |
| `visuals.ts` | `heroImage`, `heroGallery`, `studioImage`, `studioGallery` | placeholder image references, marked "Temporary ... from Unsplash" in their `alt`/`credit` fields |

All six files are small, hand-written TypeScript modules typed against
`src/types/site.ts`. There is no `process.ts` (removed in Phase 1 cleanup).

## A. Static for now

Content that stays hand-edited in code for the foreseeable future — low
change frequency, tied to branding/config rather than day-to-day studio
operations:

- Navigation links (`src/data/navigation.ts` — `navLinks`, `ctaLink`)
- Brand name ("SomStudioPhotography") and short logo text ("SomStudio")
- Basic design settings (Tailwind theme tokens, color palette in
  `app/globals.css`)
- SEO metadata (per-page `metadata` exports, `src/lib/seo.ts` —
  `siteRoutes`, `defaultDescription`, `localBusinessJsonLd`)

## B. Should later be admin-managed

Content an owner/admin will want to change without a code deploy:

- Services (`src/data/services.ts`)
- Service packages (do not exist yet — see `Package` model below)
- Portfolio categories (`src/data/portfolio.ts` — `portfolioCategories`)
- Portfolio images (`src/data/portfolio.ts` — `portfolioWorks`, currently
  one hero image + gallery per work)
- Testimonials (`src/data/testimonials.ts`)
- Contact details (`src/data/contact.ts` — phone, email, address, map URL)
- Homepage hero text/images (`src/components/sections/Hero.tsx` copy,
  `src/data/visuals.ts` — `heroImage`, `heroGallery`)
- About page content (`app/about/page.tsx` — currently hard-coded copy)
- Final CTA content (`src/components/sections/FinalCTA.tsx` — currently
  hard-coded headline/subtitle)
- Business hours (`src/data/contact.ts` — `contactInfo.businessHours`)
- Social media links (`src/data/contact.ts` — `contactInfo.socialLinks`)

Everything in this list already has a matching TypeScript shape in
`src/types/site.ts` or a plain object in `src/data/`, which is exactly
what makes it straightforward to move behind an admin panel later: the
frontend components stay the same, only the data source changes from a
static import to a database query.

## C. Future database-ready content models

Suggested fields below. Where current static data already models most of
a field, it's noted — this keeps the future migration close to a rename
rather than a redesign.

### Service
- id
- title
- slug
- shortDescription
- fullDescription
- highlights
- category
- featured
- active
- displayOrder

Current `Service` type (`src/types/site.ts`) has `id`, `title`,
`description`, `price`, `highlights`, `slug`, `featured` — close match.
Missing today: `shortDescription`/`fullDescription` split (currently one
`description`), `category` grouping, `active` flag, `displayOrder`.
`price` will likely move onto `Package` once packages exist.

### Package
- id
- serviceId
- name
- price
- description
- inclusions
- active
- displayOrder

Does not exist yet. Each current service has a single flat `price` string
(e.g. "NRS 12,000") with no tiers — `Package` is the future home for
multiple priced tiers per service.

### PortfolioCategory
- id
- name
- slug
- description
- displayOrder

Current `PortfolioCategory` type has `id`, `title`, `description`,
`slug`, `image` — close match (`title` → `name`). Missing: `displayOrder`
(currently relies on array order in `portfolio.ts`).

### PortfolioImage
- id
- categoryId
- title
- slug
- imageUrl
- altText
- description
- featured
- displayOrder

Current `PortfolioWork` type has `id`, `categoryId`, `title`,
`description`, `location`, `image` (`SiteImage`: `src`/`alt`/`credit`),
`gallery`, `featured` — close match (`image.src` → `imageUrl`,
`image.alt` → `altText`). Missing: `slug`, `displayOrder`. `location` and
multi-image `gallery` aren't in the requested shape — worth deciding
whether `PortfolioImage` stays one-row-per-image (gallery becomes
multiple `PortfolioImage` rows sharing a `workId`) or keeps a gallery
array; not decided in this phase.

### Testimonial
- id
- clientName
- serviceType
- review
- rating
- location
- featured
- active

Current `Testimonial` type has `id`, `name`, `role`, `content`, `rating`,
`service`, `location` — close match (`name` → `clientName`, `content` →
`review`, `service` → `serviceType`). Missing: `featured`, `active`.
`role` (e.g. "Bride", "Business Owner") isn't in the requested shape —
decide whether to keep it or drop it later.

### Inquiry
- id
- name
- phone
- email
- serviceType
- preferredDate
- message
- status
- createdAt

Does not exist as a stored model yet. The `/contact` page's `InquiryForm`
currently collects this exact shape (name, phone, email, service,
preferred date, message) but sends it client-side via WhatsApp — nothing
is persisted. This is the natural first model to back once a database
exists (see `PROJECT_ROADMAP.md` Phase 7).

### Booking
- id
- inquiryId
- serviceId
- packageId
- bookingDate
- status
- notes

Does not exist yet — deferred along with the `/book` page (removed in
Phase 1) until Inquiry storage exists to link from.

### Order
- id
- customerName
- phone
- email
- totalAmount
- status
- paymentStatus
- createdAt

Does not exist yet — tied to the future shop/packages phase.

### Payment
- id
- orderId
- provider
- amount
- status
- transactionId
- createdAt

Does not exist yet — tied to the future payment integration phase.

### AdminUser
- id
- name
- email
- role
- passwordHash
- active

Does not exist yet — tied to the future admin panel phase.

### SiteSettings
- id
- key
- value

Does not exist yet. Would eventually hold the "static for now" values
listed in section A/B that aren't worth a dedicated table (studio hours,
social links, contact details), as a flexible key/value store.
