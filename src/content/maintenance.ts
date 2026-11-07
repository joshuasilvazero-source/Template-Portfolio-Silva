/**
 * Monthly website care plans. Prices, allowances, and features live here only.
 * Allowances are TOTALS per plan — a higher plan replaces the lower allowance,
 * it never stacks on top of it.
 */

export type PlanId = 'essential' | 'business' | 'premium';

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  editingAllowance: string; // total monthly editing time
  audience: string;
  inheritsFrom?: string;
  features: string[];
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    id: 'essential',
    name: 'Essential Care',
    price: 79,
    editingAllowance: '30 minutes',
    audience: 'For small sites that need a regular check and the occasional edit.',
    features: [
      'Monthly visual and functionality check',
      'Broken-link check',
      'Responsive display review on phone, tablet, and desktop',
      'Up to 30 minutes of minor content edits',
      'Email support',
      'Monthly maintenance summary',
    ],
  },
  {
    id: 'business',
    name: 'Business Care',
    price: 149,
    editingAllowance: '2 hours',
    audience: 'For businesses that update their site regularly.',
    inheritsFrom: 'Everything in Essential, plus:',
    features: [
      'Up to 2 hours total of front-end edits (replaces the 30 minutes)',
      'Responsive layout fixes',
      'Basic front-end performance check',
      'Minor UI improvements',
      'Monthly maintenance report',
      'Higher scheduling priority',
    ],
    featured: true,
  },
  {
    id: 'premium',
    name: 'Premium Care',
    price: 299,
    editingAllowance: '4 hours',
    audience: 'For businesses that want ongoing front-end improvement.',
    inheritsFrom: 'Everything in Business, plus:',
    features: [
      'Up to 4 hours total of front-end changes (replaces the 2 hours)',
      'Priority support during business hours',
      'Monthly UI/UX recommendations',
      'Quarterly design review',
      'Front-end improvement planning',
    ],
  },
];

/** Rows for the comparison table. `true` = included, string = value shown. */
export const comparisonRows: { label: string; values: Record<PlanId, boolean | string> }[] = [
  { label: 'Monthly price', values: { essential: '$79', business: '$149', premium: '$299' } },
  { label: 'Total editing time per month', values: { essential: '30 min', business: '2 hours', premium: '4 hours' } },
  { label: 'Visual and functionality check', values: { essential: true, business: true, premium: true } },
  { label: 'Broken-link check', values: { essential: true, business: true, premium: true } },
  { label: 'Responsive display review', values: { essential: true, business: true, premium: true } },
  { label: 'Email support', values: { essential: true, business: true, premium: true } },
  { label: 'Monthly write-up', values: { essential: 'Summary', business: 'Report', premium: 'Report' } },
  { label: 'Responsive layout fixes', values: { essential: false, business: true, premium: true } },
  { label: 'Front-end performance check', values: { essential: false, business: true, premium: true } },
  { label: 'Minor UI improvements', values: { essential: false, business: true, premium: true } },
  { label: 'Scheduling priority', values: { essential: 'Standard', business: 'Higher', premium: 'Highest' } },
  { label: 'Monthly UI/UX recommendations', values: { essential: false, business: false, premium: true } },
  { label: 'Quarterly design review', values: { essential: false, business: false, premium: true } },
  { label: 'Improvement planning', values: { essential: false, business: false, premium: true } },
];

/** Plan rules. Shown on the maintenance page and accepted before checkout. */
export const planTerms = [
  'Plans cover agreed front-end work: content edits, layout and styling fixes, and visual updates.',
  'Requests are completed within your plan’s monthly editing time. Work beyond it is quoted first and billed at $40/hour only with your approval.',
  'Unused editing time does not roll over to the next month.',
  'Redesigns, new pages, and larger projects are quoted separately.',
  'Hosting, domain, and third-party software fees are separate and paid by you directly.',
  'Backend work, databases, server administration, and custom infrastructure are not included.',
  'Backups, uptime monitoring, malware removal, and security services are not included.',
  'Response times are measured during published business hours. Emergency support is not guaranteed.',
  'Plans bill monthly through Stripe and renew automatically until cancelled.',
  'You can cancel any time from the billing portal. Cancellation takes effect at the end of the current billing period; partial months are not refunded.',
];

/** Plan editing time in a sentence, for consistent wording everywhere. */
export const allowanceNote =
  'Editing time is a monthly total for your plan. Moving up a plan replaces your allowance — it does not add to it.';
