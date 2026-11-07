import { paymentTerms } from './pricing';

/** The client journey, from first message to optional ongoing care. */
export const process = [
  {
    name: 'Inquiry',
    body: 'Tell me about your business and what you need. I reply within one business day.',
  },
  {
    name: 'Discovery call',
    body: 'A short call to go over goals, pages, content, timeline, and budget. No cost, no obligation.',
  },
  {
    name: 'Proposal',
    body: 'A written proposal with scope, deliverables, timeline, and a fixed price or clear estimate.',
  },
  {
    name: 'Agreement and deposit',
    body: `You sign the agreement and pay a ${paymentTerms.deposit.toLowerCase()}.`,
  },
  {
    name: 'Design',
    body: 'Layouts and visual design for your review. Two revision rounds are included.',
  },
  {
    name: 'Development',
    body: 'I build the responsive site and test it on phones, tablets, and desktops.',
  },
  {
    name: 'Review',
    body: 'You review the working site on a private preview link and request final changes.',
  },
  {
    name: 'Final payment and launch',
    body: 'After your approval and the final 50% payment, the site goes live on your domain.',
  },
  {
    name: 'Ongoing care (optional)',
    body: 'Enroll in a monthly care plan for regular checks and edits, or reach out whenever you need help.',
  },
] as const;

/** Short version for the home page. */
export const processShort = [
  { name: 'Talk', body: 'A free discovery call about your business, goals, and budget.' },
  { name: 'Plan', body: 'A written proposal with clear scope, timeline, and price.' },
  { name: 'Design and build', body: 'You review designs, then a working preview, with two revision rounds.' },
  { name: 'Launch and care', body: 'Your site goes live. Add a monthly care plan if you want ongoing help.' },
] as const;
