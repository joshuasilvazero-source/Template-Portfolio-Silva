import { INQUIRY_SERVICES } from '@/content/services';

/** Shared by the inquiry form (client) and /api/contact (server). */

export const BUDGETS = [
  'Under $500',
  '$500–$1,000',
  '$1,000–$2,000',
  '$2,000–$3,500',
  '$3,500+',
  'Not sure yet',
] as const;

export const TIMELINES = [
  'As soon as possible',
  'Within 1 month',
  '1–3 months',
  'Flexible',
] as const;

export const CARE_INTEREST = ['Yes', 'Maybe later', 'No'] as const;

export const PLAN_IDS = ['essential', 'business', 'premium'] as const;

export type Inquiry = {
  name: string;
  business: string;
  email: string;
  website: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  care: string;
  plan: string;
};

export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;

export const LIMITS = { name: 100, business: 120, email: 200, website: 200, message: 4000 } as const;
const MIN_MESSAGE = 20;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export function normalizeInquiry(raw: Record<string, unknown>): Inquiry {
  return {
    name: str(raw.name),
    business: str(raw.business),
    email: str(raw.email),
    website: str(raw.website),
    service: str(raw.service),
    budget: str(raw.budget),
    timeline: str(raw.timeline),
    message: str(raw.message),
    care: str(raw.care),
    plan: str(raw.plan),
  };
}

const oneOf = (list: readonly string[], v: string) => list.includes(v);

export function validateInquiry(d: Inquiry): InquiryErrors {
  const e: InquiryErrors = {};
  if (!d.name) e.name = 'Enter your name.';
  else if (d.name.length > LIMITS.name) e.name = `Keep your name under ${LIMITS.name} characters.`;

  if (d.business.length > LIMITS.business) e.business = `Keep the business name under ${LIMITS.business} characters.`;

  if (!d.email) e.email = 'Enter your email address so I can reply.';
  else if (!EMAIL_RE.test(d.email) || d.email.length > LIMITS.email)
    e.email = 'Enter an email address in the format name@example.com.';

  if (d.website && (d.website.length > LIMITS.website || !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+\S*$/i.test(d.website)))
    e.website = 'Enter a web address like example.com, or leave this blank.';

  if (!oneOf(INQUIRY_SERVICES, d.service)) e.service = 'Choose the service you are interested in.';
  if (!oneOf(BUDGETS, d.budget)) e.budget = 'Choose an estimated budget.';
  if (!oneOf(TIMELINES, d.timeline)) e.timeline = 'Choose a timeline.';

  if (!d.message) e.message = 'Tell me a little about your project.';
  else if (d.message.length < MIN_MESSAGE) e.message = `Add a bit more detail (at least ${MIN_MESSAGE} characters).`;
  else if (d.message.length > LIMITS.message) e.message = `Keep the description under ${LIMITS.message} characters.`;

  if (d.care && !oneOf(CARE_INTEREST, d.care)) e.care = 'Choose an option.';
  if (d.plan && !oneOf(PLAN_IDS, d.plan)) e.plan = 'Unknown plan.';
  return e;
}
