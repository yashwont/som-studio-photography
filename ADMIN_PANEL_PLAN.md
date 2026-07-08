# SomStudioPhotography - Admin Panel Plan

Phase 4 planning document for the future internal admin panel. This is
planning only: no admin routes, no authentication, no CRUD UI, and no
backend behavior changes yet.

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

- Status: started

- `AdminUser` model already exists
- Create secure admin login later
- Use password hashing
- Protect all `/admin/*` routes
- Decide between Auth.js/NextAuth or secure custom session auth before
  coding

### Phase 4C: Admin dashboard shell

- Status: started

- `/admin`
- Sidebar layout
- Topbar
- Summary cards
- No CRUD yet

### Phase 4D: Services CRUD

- Phase 4D-1 (list-only): Status: started
- Phase 4D-2 (service detail, read-only): Status: started
- Phase 4D-3 (service edit): Status: started
- Phase 4D-4 (service create): Status: started

- List services
- Create service
- Edit service
- Activate/deactivate service
- Display order
- Manage highlights
- Manage packages later

### Phase 4E: Portfolio management

- Portfolio categories
- Portfolio images
- Featured images
- Ordering
- Image upload/storage later

### Phase 4F: Testimonials management

- Add/edit/delete testimonials
- Feature/unfeature reviews
- Active/inactive status

### Phase 4G: Inquiries

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

## Admin Safety Rules

- Never expose admin pages without authentication.
- Never store plain-text passwords.
- Never commit `.env`.
- Do not build image upload until storage choice is finalized.
- Do not build payment until orders/packages flow is stable.
- Keep the public website stable while admin is added gradually.
- Make small commits per admin phase.

## Auth Decision Needed

### Auth.js / NextAuth

- Pros: established ecosystem, session handling, adapters, provider
  support, easier future extensibility.
- Cons: more setup surface, more framework-specific conventions, may be
  heavier than this project needs for a single admin surface.

### Custom session-based admin auth

- Pros: smaller surface area, easier to tailor to a single admin app,
  simpler mental model for one internal login.
- Cons: more security responsibility on this codebase, more to implement
  correctly, fewer built-in patterns.

Recommended decision point: choose before Phase 4B implementation, based
on whether the project wants standardized auth plumbing or a minimal
single-purpose admin session.

## First Admin Feature Recommendation

1. Admin authentication foundation
2. Admin dashboard shell
3. Services CRUD first
