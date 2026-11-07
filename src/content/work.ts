/**
 * Case studies. Only verified information — no invented metrics or testimonials.
 *
 * All client work was delivered as a UI/UX Specialist at FocusPoint. My
 * contribution was specific front-end components and improvements, not the
 * entire client website — the copy says so.
 *
 * Images: `visual` renders an original illustration, NOT a client screenshot.
 * Add real screenshots only after FocusPoint and the client approve.
 *
 * Links: set `link` only once you have permission to point visitors at the site.
 */

export type VisualKind = 'search' | 'product-cards' | 'checkout' | 'category' | 'product-page';

export type CaseStudy = {
  slug: string;
  client: string;
  category: string;
  summary: string;
  overview: string;
  challenge: string;
  responsibilities: string[];
  improvements: string[];
  technologies: string[];
  visual: VisualKind;
  link?: { href: string; label: string };
  featured?: boolean;
};

export const DELIVERED_THROUGH = 'Delivered as UI/UX Specialist at FocusPoint';

export const caseStudies: CaseStudy[] = [
  {
    slug: 'lovato-electric',
    client: 'Lovato Electric',
    category: 'B2B storefront',
    summary: 'Storefront navigation, cart, and checkout presentation for a B2B customer portal.',
    overview:
      'Lovato Electric’s B2B portal is where business customers browse products, manage orders, and check out. I worked on the customer-facing interface inside the existing FocusPoint CMS.',
    challenge:
      'Business buyers need to move quickly through dense product data, order history, and purchase-order checkout. Clipped information and unclear checkout states slowed them down.',
    responsibilities: [
      'Refined the header, footer, and side navigation',
      'Improved shopping cart, product list, and order review presentation',
      'Corrected purchase-order checkout behavior and credit-card conditional display',
      'Improved invoice selection, order history filters, and quote list interactions',
      'Debugged grid pagination, filters, and date picker behavior',
      'Built promotional portal banners in English and French',
    ],
    improvements: [
      'Clearer checkout flow with fewer confusing states',
      'Order confirmation details no longer clipped',
      'Better information hierarchy across the customer portal',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'FocusPoint CMS', 'Kendo UI'],
    visual: 'checkout',
    featured: true,
  },
  {
    slug: 'buses-for-sale',
    client: 'BusesForSale.com',
    category: 'Marketplace website',
    summary: 'Mobile search, navigation, and layout improvements for a vehicle marketplace.',
    overview:
      'BusesForSale.com is a marketplace for buying and selling buses. I delivered responsive interface improvements across its CMS-driven pages.',
    challenge:
      'Visitors search large inventories on phones. Navigation, filters, and listing layouts needed to work well on small screens without breaking existing CMS content.',
    responsibilities: [
      'Responsive improvements across production CMS pages',
      'Mobile search and country-filter interface',
      'Navigation, content presentation, and pagination interfaces',
      'Author profile page design and styling',
      'Debugged the sell-your-bus form and image upload display issues',
    ],
    improvements: [
      'Resolved production layout issues',
      'Improved mobile usability across key pages',
      'More consistent navigation and pagination',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'FocusPoint CMS', 'HubSpot'],
    visual: 'search',
    featured: true,
  },
  {
    slug: 'jackson-pottery',
    client: 'Jackson Pottery',
    category: 'E-commerce',
    summary: 'Product cards, image modals, and mobile fixes for an online pottery store.',
    overview:
      'Jackson Pottery sells pottery and containers online. I improved product presentation and fixed interface issues on its e-commerce storefront.',
    challenge:
      'Product availability varied, images were too small in the cart, and a modal dialog caused the page to overflow on some screens.',
    responsibilities: [
      'Redesigned product and factory card interfaces',
      'Added availability states such as “Coming soon”',
      'Made product images more prominent in the cart',
      'Reorganized quantity, details, and remove actions',
      'Fixed responsive and modal layout bugs, including page overflow behind dialogs',
    ],
    improvements: [
      'Product images easier to see while shopping',
      'Clearer status for unavailable items',
      'Modal dialogs no longer break the page layout',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'FocusPoint CMS'],
    visual: 'product-cards',
    featured: true,
  },
  {
    slug: 'totalworkwear',
    client: 'TotalWorkWear',
    category: 'E-commerce',
    summary: 'Responsive category layouts and mobile interaction improvements.',
    overview:
      'TotalWorkWear sells workwear online. I improved how product categories and product interfaces behave on different screen sizes.',
    challenge:
      'Category browsing needed to stay usable on phones, where long category lists and product grids can become cramped.',
    responsibilities: [
      'Responsive category page layouts',
      'Mobile interaction improvements',
      'Product interface enhancements',
    ],
    improvements: ['Easier category browsing on mobile', 'More consistent product layouts across screen sizes'],
    technologies: ['HTML', 'CSS', 'JavaScript', 'FocusPoint CMS'],
    visual: 'category',
  },
  {
    slug: 'islides',
    client: 'iSlides',
    category: 'E-commerce',
    summary: 'Product pages, interactive controls, and responsive product presentation.',
    overview:
      'iSlides sells products online. I worked on product page presentation and the interactive controls shoppers use to choose options.',
    challenge:
      'Product pages had to present options and details clearly while staying responsive across devices.',
    responsibilities: [
      'Product page layouts',
      'Interactive product controls',
      'Responsive product presentation',
    ],
    improvements: ['Clearer product presentation', 'Product controls that work across screen sizes'],
    technologies: ['HTML', 'CSS', 'JavaScript', 'FocusPoint CMS'],
    visual: 'product-page',
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find(c => c.slug === slug);
