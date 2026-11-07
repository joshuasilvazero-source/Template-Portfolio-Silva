/**
 * One source of truth for every price on the site.
 * Pricing page, services page, home page, FAQ, and plan cards all read from here.
 */

export type ProjectPrice = {
  id: string;
  name: string;
  price: string;
  summary: string;
  includes: string[];
  serviceValue: string; // matches an option in the inquiry form
};

export const projectPricing: ProjectPrice[] = [
  {
    id: 'landing-page',
    name: 'Landing page',
    price: '$400–$800',
    summary: 'One focused page built around a single offer, event, or campaign.',
    includes: [
      'One responsive page, designed and built',
      'Up to 6 content sections',
      'Contact or signup call to action',
      'Basic on-page SEO and page metadata',
      'Two rounds of revisions',
    ],
    serviceValue: 'Landing page',
  },
  {
    id: 'small-business-website',
    name: 'Small business website',
    price: '$1,000–$2,000',
    summary: 'A complete, professional site for a local business or independent professional.',
    includes: [
      'Up to 5 custom-designed pages',
      'Mobile, tablet, and desktop layouts',
      'Contact form through a hosted service',
      'On-page SEO, page titles, and social previews',
      'Launch support and a handoff walkthrough',
      'Two rounds of revisions',
    ],
    serviceValue: 'Small business website',
  },
  {
    id: 'website-redesign',
    name: 'Website redesign',
    price: '$800–$2,500',
    summary: 'Modernize an outdated site and make it easier to use on every screen.',
    includes: [
      'Review of your current site and its problems',
      'New visual design and layout',
      'Responsive rebuild of existing pages',
      'Content carried over and tidied up',
      'Two rounds of revisions',
    ],
    serviceValue: 'Website redesign',
  },
  {
    id: 'front-end-fixes',
    name: 'Front-end fixes',
    price: 'From $40/hour',
    summary: 'Targeted fixes for layout bugs, mobile issues, and broken components.',
    includes: [
      'Responsive and CSS troubleshooting',
      'Component and interaction repairs',
      'Small visual and usability improvements',
      'Estimate agreed before work starts',
    ],
    serviceValue: 'Front-end fixes',
  },
];

/** What changes a quote — shown on the pricing page. */
export const pricingFactors = [
  'Number of pages and unique layouts',
  'Whether your text, photos, and logo are ready',
  'Third-party tools to connect (booking, forms, Shopify, email signup)',
  'Custom interactions or animation',
  'Revision rounds beyond the two included',
];

export const notIncluded = [
  'Domain registration and hosting fees (you own and pay for these directly)',
  'Paid third-party tools, themes, plugins, or stock photography',
  'Copywriting and professional photography',
  'Logo and full brand identity design',
  'Backend systems, databases, custom logins, or custom payment processing',
];

export const paymentTerms = {
  deposit: '50% deposit to reserve your project start date',
  final: '50% on final approval, before launch',
  revisions: 'Two rounds of revisions are included in standard projects',
  hourlyRate: '$40/hour',
};
