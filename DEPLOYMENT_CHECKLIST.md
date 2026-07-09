# Deployment Checklist

## Required environment variables

Set these in the hosting provider's environment settings — never commit real values (`.env` is gitignored; `.env.example` documents placeholders only).

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_SESSION_SECRET` | Yes in production | Signs the admin session cookie. The app throws on boot in production if this is missing — no insecure fallback. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Base URL used for canonical links, sitemap, JSON-LD, and the admin link inside inquiry notification emails. Falls back to `https://somstudiophotography.com.np` if unset. |
| `CLOUDINARY_CLOUD_NAME` | Optional | Enables portfolio image upload. Without it, the upload field returns a friendly error and the manual Image URL field still works. |
| `CLOUDINARY_API_KEY` | Optional | See above. |
| `CLOUDINARY_API_SECRET` | Optional | See above. |
| `RESEND_API_KEY` | Optional | Enables inquiry email notifications. Without it, submissions still save to the database; notifications are silently skipped. |
| `INQUIRY_NOTIFY_EMAIL` | Optional | Where the "new inquiry" admin notification is sent. |
| `INQUIRY_FROM_EMAIL` | Optional | Must be a sender address verified in Resend. |

## Database migration

Run against the production database before or as part of deploy:

```bash
npx prisma migrate deploy
```

Do not use `prisma migrate dev` in production (it can prompt interactively and is meant for local development).

This applies all pending migrations, including
`20260709064023_add_inquiry_service_package_links` (adds `Inquiry.serviceId`,
`Inquiry.packageId`, `Inquiry.notes`, and the `BOOKED` status). **This
migration must be applied before the first production inquiry is
submitted** — without it, `submitInquiry` will fail because the columns
it writes to won't exist yet.

## Build & verification commands

Run these before deploying, in order:

```bash
npx prisma validate
npx prisma generate
npx tsc --noEmit
npx eslint .
npm run build
```

All five must pass cleanly with no errors.

## Cloudinary setup (optional — portfolio image upload)

1. Create a Cloudinary account and note the Cloud Name, API Key, and API Secret from the dashboard.
2. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in the production environment.
3. No further setup needed — uploads go to a `portfolio` folder in your Cloudinary account, and `next.config.ts` already allows `res.cloudinary.com` as an image source.
4. Until these are set, admins can still add/edit portfolio images by pasting an image URL directly (the fallback path is always available).

## Resend setup (optional — inquiry email notifications)

1. Create a Resend account and verify a sending domain (or use their test domain during setup).
2. Set `RESEND_API_KEY` in the production environment.
3. Set `INQUIRY_FROM_EMAIL` to an address on the verified domain.
4. Set `INQUIRY_NOTIFY_EMAIL` to the inbox that should receive new-inquiry alerts.
5. Until these are set, public inquiry submissions still save to the database normally — notification emails are just skipped, never block or fail the submission.

## Post-deploy smoke tests

Public site:
- [ ] `/` loads
- [ ] `/services` loads and lists active services with working "Book Now" links
- [ ] `/portfolio` loads and category links work
- [ ] `/portfolio/[work]` loads for at least one image
- [ ] `/contact` loads, service dropdown is populated, submitting a test inquiry succeeds and opens WhatsApp
- [ ] `/testimonials`, `/about` load

Admin:
- [ ] `/admin/login` loads; logging in with a valid admin account succeeds
- [ ] Visiting any `/admin/*` route while logged out redirects to `/admin/login`
- [ ] `/admin` dashboard shows real counts (inquiries by status, services, packages, portfolio categories/images, testimonials) and a non-empty recent-inquiries list if any exist
- [ ] `/admin/services`, `/admin/packages`, `/admin/portfolio`, `/admin/portfolio/images`, `/admin/inquiries` all load and list real data
- [ ] Create and edit flows work end-to-end for services, packages, portfolio categories, and portfolio images
- [ ] The test inquiry submitted above appears in `/admin/inquiries` and its detail page allows a status/notes update
- [ ] If Resend is configured, confirm the admin notification email arrived for the test inquiry
