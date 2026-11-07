/**
 * Services offered. Each one powers a section on /services and a card on the home page.
 * `inquiryValue` must match an option in INQUIRY_SERVICES so "Request a quote"
 * links prefill the form.
 */

export const INQUIRY_SERVICES = [
  'Small business website',
  'Website redesign',
  'Landing page',
  'Front-end development',
  'UI/UX design',
  'E-commerce interface design',
  'Front-end fixes',
  'Monthly website care',
  'Not sure yet',
] as const;

export type InquiryService = (typeof INQUIRY_SERVICES)[number];

export type Service = {
  id: string;
  name: string;
  short: string;
  value: string;
  deliverables: string[];
  limits: string;
  price: string;
  inquiryValue: InquiryService;
};

export const services: Service[] = [
  {
    id: 'custom-website-design',
    name: 'Custom website design',
    short: 'A professional, responsive website built for your business — not a recycled template.',
    value:
      'Your website is often the first impression customers get. I design and build a site that explains what you do, looks right on every phone, and makes it easy for people to contact you.',
    deliverables: [
      'Page structure and layout plan',
      'Custom visual design',
      'Responsive build for phone, tablet, and desktop',
      'Contact form through a hosted form service',
      'Page titles, descriptions, and social previews',
      'Launch on your hosting and a handoff walkthrough',
    ],
    limits:
      'Copywriting, photography, logo design, and paid tools are not included. Online stores and booking systems are connected through hosted services such as Shopify or Calendly.',
    price: '$1,000–$2,000',
    inquiryValue: 'Small business website',
  },
  {
    id: 'website-redesign',
    name: 'Website redesign',
    short: 'Modernize an outdated site and make it easier to use.',
    value:
      'If your site looks dated, breaks on phones, or makes visitors hunt for basic information, a redesign fixes the presentation without starting your business from scratch.',
    deliverables: [
      'Review of your current site and what is holding it back',
      'Updated layout, typography, and visual design',
      'Responsive rebuild of your existing pages',
      'Existing content moved over and tidied up',
      'Clearer navigation and calls to action',
    ],
    limits:
      'Migrating data between platforms, rebuilding backend features, and rewriting large amounts of copy are quoted separately or referred out.',
    price: '$800–$2,500',
    inquiryValue: 'Website redesign',
  },
  {
    id: 'landing-pages',
    name: 'Landing page development',
    short: 'A focused page for one offer, campaign, or event.',
    value:
      'A landing page does one job: get a visitor to call, book, buy, or sign up. Clear structure and a single call to action make ads and promotions work harder.',
    deliverables: [
      'One responsive page with up to 6 sections',
      'Headline and section structure guidance',
      'Call to action wired to your form, booking link, or store',
      'Page metadata and social preview',
    ],
    limits: 'Ad campaign management, copywriting, and analytics setup are not included.',
    price: '$400–$800',
    inquiryValue: 'Landing page',
  },
  {
    id: 'front-end-development',
    name: 'Front-end development',
    short: 'HTML, CSS, JavaScript, and React interfaces built from your designs.',
    value:
      'Already have a design or a development team? I turn mockups into clean, responsive, accessible interface code and reusable components.',
    deliverables: [
      'Responsive HTML, CSS, and JavaScript',
      'React components (Vite or Next.js)',
      'Tailwind CSS styling',
      'Interaction and animation with Framer Motion',
      'Code delivered through Git and GitHub',
    ],
    limits: 'APIs, databases, authentication, and server work are outside my scope.',
    price: 'Quoted per project or from $40/hour',
    inquiryValue: 'Front-end development',
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX design',
    short: 'Wireframes, prototypes, and layouts that make your site easier to use.',
    value:
      'Good design is about more than looks. I map out how people move through your site and design layouts that help them find what they need quickly.',
    deliverables: [
      'Wireframes for key pages',
      'Clickable Figma prototypes',
      'Visual design for desktop and mobile',
      'Usability recommendations for existing sites',
    ],
    limits: 'Formal user research studies and brand identity design are not included.',
    price: 'Quoted per project',
    inquiryValue: 'UI/UX design',
  },
  {
    id: 'ecommerce-interface-design',
    name: 'E-commerce interface design',
    short: 'Product cards, category pages, and storefront layouts that help people shop.',
    value:
      'I have improved product cards, category layouts, cart presentation, and checkout screens on real e-commerce and B2B storefronts. Small interface changes can make shopping noticeably easier.',
    deliverables: [
      'Shopify theme front-end customization',
      'Product card and product page layouts',
      'Category and filter interfaces',
      'Cart and checkout presentation fixes',
      'Mobile shopping improvements',
    ],
    limits:
      'Payment processing, inventory systems, custom Shopify apps, and backend integrations are not included.',
    price: 'Quoted per project',
    inquiryValue: 'E-commerce interface design',
  },
  {
    id: 'front-end-fixes',
    name: 'Front-end fixes',
    short: 'Broken layout, odd mobile behavior, or a component that stopped working.',
    value:
      'Quick, careful fixes for the things that make a site look broken: overflowing layouts, clipped content, misaligned components, and mobile display problems.',
    deliverables: [
      'Diagnosis of the problem',
      'CSS and responsive layout fixes',
      'Component and interaction repairs',
      'Cross-browser and device testing',
    ],
    limits:
      'Server errors, hosting problems, plugin conflicts, and security issues need a backend or hosting specialist.',
    price: 'From $40/hour',
    inquiryValue: 'Front-end fixes',
  },
  {
    id: 'website-care',
    name: 'Monthly website care',
    short: 'Ongoing checks, edits, and front-end fixes for a flat monthly fee.',
    value:
      'Keep your site current without hunting for help every time something needs changing. Each plan includes a set amount of editing time and a monthly check-in.',
    deliverables: [
      'Monthly visual and functionality check',
      'Content and layout edits within your plan’s hours',
      'Monthly summary or report',
      'Cancel any time from the billing portal',
    ],
    limits: 'Hosting, backups, security, and backend work are not included in any plan.',
    price: '$79–$299/month',
    inquiryValue: 'Monthly website care',
  },
];
