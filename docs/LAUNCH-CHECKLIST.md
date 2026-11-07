# Launch checklist

Status as of this rebuild. Items marked **Blocker** should be done before you promote the site to clients.

## Configuration

- [ ] **Blocker:** set `SITE_URL` in Vercel to the production domain, then redeploy (canonical URLs, sitemap and social previews use it)
- [ ] **Blocker:** add `EMAIL_USER` and `EMAIL_PASSWORD` (Google App Password) in Vercel. Then send one real test inquiry from the live site and confirm both the inquiry and the confirmation email arrive
- [ ] Stripe: follow `docs/STRIPE-SETUP.md`, add the four `NEXT_PUBLIC_STRIPE_*` variables and redeploy. Until then, care plans show a working "Request this plan" path instead of checkout
- [ ] Connect a custom domain in Vercel. A professional email on that domain (Google Workspace, Fastmail, etc.) is recommended, then update `site.email` and `EMAIL_USER`
- [ ] Submit `https://YOUR-DOMAIN/sitemap.xml` in Google Search Console
- [ ] Create a free **Google Business Profile** as a service-area business (Colorado Springs, Fountain). This is the biggest local-SEO lever

## Content review and permissions

- [ ] **Blocker:** confirm with FocusPoint that you may name clients (BusesForSale.com, Lovato Electric, Jackson Pottery, TotalWorkWear, iSlides) and describe your work on a freelance business site. The site already states the work was delivered through FocusPoint and that names do not imply endorsement
- [ ] Do not add client screenshots, logos or live links until FocusPoint **and** the client approve. Two links were intentionally removed: the Lovato redesign concept (`lovato-portal-redesign.vercel.app`) and a FocusPoint staging URL for Jackson Pottery. Add approved links through the `link` field in `src/content/work.ts`
- [ ] Verify the About page facts: Army role (91B, Sergeant) and University of Central Bayamón wording. The old site listed conflicting service dates, so the new copy has no dates
- [ ] Confirm business hours and response-time promises in `src/content/site.ts` are ones you can keep alongside client projects
- [ ] `public/images/resume.pdf` is still publicly reachable (not linked anywhere). Delete it if you do not want it online

## Legal and policy (professional review)

- [ ] **Blocker:** have the privacy notice (`/privacy`) reviewed. It describes current practices: Gmail delivery, Stripe, Vercel logs, no analytics or cookies. Update it if you add analytics, a newsletter or another form provider
- [ ] **Blocker:** have the care plan terms (`src/content/maintenance.ts` → `planTerms`) reviewed, especially the cancellation and no-partial-refund wording, before enabling live Stripe links
- [ ] Have every template in `docs/business/` reviewed before you sign or send one
- [ ] Register the business with the State of Colorado (trade name or LLC), check Colorado Springs and El Paso County licensing, and set up sales-tax and income-tax handling with an accountant. If you register a trade name, update `site.businessName`
- [ ] Consider professional liability (E&O) insurance

## Already verified in this build

- Production build passes. All pages are statically rendered.
- `npm audit --omit=dev`: 0 vulnerabilities
- All 15 routes render at 375, 768 and 1280px with no page-level horizontal overflow, one H1 each and no images missing alt text
- Inquiry form: client validation with an error summary and focus management, server validation, honeypot, time trap, missing-credentials error state and success state (mocked, so no email was sent)
- Care plan checkout flow: terms checkbox gate, keyboard focus handling, request fallback when no link is set, portal link appears when configured (tested with placeholder links)
- Mobile menu: open/close, Escape and close-on-navigate. Skip link works
- No secrets in client code: only `NEXT_PUBLIC_STRIPE_*` (public URLs) reach the browser

## Not yet tested

- Real email delivery from Vercel (needs production credentials)
- Real Stripe checkout (needs Payment Links)
- Lighthouse on the deployed site. Run it on a Vercel preview URL after deploying
- Screen reader pass with NVDA or VoiceOver (automated checks only so far)

## After launch: make the site its own proof

Until you have a freelance client who agrees to be shown with a live link, this site is your strongest example.

- [ ] Run Lighthouse and an accessibility checker on the live site and record the real scores
- [ ] Add a short "How this site was built" block (home or About) with those measured results. Use only numbers you measured, re-check them after big changes, and say when they were taken
- [ ] Replace the drawn case-study visuals with real screenshots or links once a client gives written permission
- [ ] Add the first real testimonial only after a client agrees to its exact wording and use of their name
