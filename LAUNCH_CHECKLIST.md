# Launch Checklist

Before publishing the site, replace the temporary launch values below.

- Confirm the production domain and set `NEXT_PUBLIC_SITE_URL` if it is not `https://somstudiophotography.com.np`.
- Replace `src/data/contact.ts` with the real phone number, WhatsApp number, email address, studio address, social links, and business hours.
- Replace the temporary Unsplash images in `src/data/visuals.ts` and `src/data/portfolio.ts` with real SomStudioPhotography photos.
- Confirm every service in `src/data/services.ts` matches the studio's actual offerings.
- Confirm every testimonial in `src/data/testimonials.ts` is approved for public use.
- Run `npm run build` before deployment.
