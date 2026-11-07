/**
 * Business details used across the whole site.
 * Edit this file to change your name, contact info, service area, or hours.
 */

export const site = {
  name: 'Joshua Silva',
  businessName: 'Joshua Silva Web Design',
  tagline: 'Web design & front-end development',
  description:
    'Freelance web designer and front-end developer in Colorado Springs. Custom websites, redesigns, landing pages, and monthly website care for small businesses.',

  /**
   * Production URL, used for canonical tags, the sitemap, and social previews.
   * Order: SITE_URL if set, then Vercel's production domain (set automatically
   * on Vercel, e.g. silvajoshua.com), then localhost for local dev.
   */
  url: (
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')
  ).replace(/\/$/, ''),

  email: 'joshuasilvazero@gmail.com',
  location: 'Colorado Springs, Colorado',
  serviceArea: ['Colorado Springs', 'Fountain', 'Monument', 'Pueblo', 'Remote across the U.S.'],
  /** Response times on the site are measured against these hours. */
  hours: 'Monday–Friday, 9 a.m.–5 p.m. Mountain Time',
  responseTime: 'one business day',

  social: {
    github: 'https://github.com/joshuasilvazero-source',
    linkedin: 'https://www.linkedin.com/in/joshua-silva-14027026a/',
  },
} as const;

/**
 * Stripe-hosted billing. These are PUBLIC Payment Link / portal URLs — never
 * put a Stripe secret key here. Set them in Vercel → Settings → Environment
 * Variables. While a value is empty, the site shows a "request this plan"
 * fallback instead of a checkout button.
 */
export const billing = {
  paymentLinks: {
    essential: process.env.NEXT_PUBLIC_STRIPE_LINK_ESSENTIAL || '',
    business: process.env.NEXT_PUBLIC_STRIPE_LINK_BUSINESS || '',
    premium: process.env.NEXT_PUBLIC_STRIPE_LINK_PREMIUM || '',
  },
  customerPortal: process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL || '',
} as const;

export const nav = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Website care', href: '/maintenance' },
  { label: 'About', href: '/about' },
] as const;
