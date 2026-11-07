import { paymentTerms } from './pricing';
import { site } from './site';

export type Faq = { q: string; a: string };

export const projectFaqs: Faq[] = [
  {
    q: 'How much does a website cost?',
    a: 'Most small business websites fall between $1,000 and $2,000, landing pages between $400 and $800, and redesigns between $800 and $2,500. These are starting ranges. Your written proposal gives a final price based on pages, content readiness, and integrations.',
  },
  {
    q: 'How does payment work?',
    a: `${paymentTerms.deposit}, and the remaining 50% on final approval before launch. The exact schedule is set in your signed agreement.`,
  },
  {
    q: 'How long does a project take?',
    a: 'A landing page usually takes one to two weeks. A small business website usually takes three to six weeks. The biggest factor is how quickly content and feedback come in.',
  },
  {
    q: 'Do I own my website?',
    a: 'Yes. Once the final payment is made, you own the finished design and site files. Your domain and hosting are registered in your name from the start, so you are never locked in.',
  },
  {
    q: 'Do you write the content and provide photos?',
    a: 'You provide your text, photos, and logo. I can help structure and edit content, and recommend stock photography or a local photographer if you need one.',
  },
  {
    q: 'Can you build an online store or booking system?',
    a: 'Yes, through established hosted services. I customize Shopify storefronts and connect tools like Calendly or hosted forms. I do not build custom payment processing, databases, or login systems.',
  },
  {
    q: 'Do you only work with Colorado businesses?',
    a: `I am based in ${site.location} and work with businesses in Colorado Springs, Fountain, and nearby, but I also work remotely with clients across the U.S.`,
  },
];

export const careFaqs: Faq[] = [
  {
    q: 'What counts as “editing time”?',
    a: 'Time spent on your requests: updating text and images, adjusting layouts, fixing display problems, and small interface improvements. Monthly checks and your report are included on top of your editing time.',
  },
  {
    q: 'Does the Business plan include 2 hours plus Essential’s 30 minutes?',
    a: 'No. Each plan’s editing time is its total. Business includes 2 hours total and Premium includes 4 hours total.',
  },
  {
    q: 'What if I need more time in a month?',
    a: 'I will tell you before going over. Extra work is quoted first and billed at $40/hour only if you approve it. Larger projects are quoted separately.',
  },
  {
    q: 'Does unused time roll over?',
    a: 'No. Editing time resets each billing month.',
  },
  {
    q: 'Do care plans include hosting, backups, or security?',
    a: 'No. Plans cover front-end work only. Hosting, domains, backups, uptime monitoring, and security stay with your hosting provider.',
  },
  {
    q: 'Do I need a website built by you to sign up?',
    a: 'No. If I did not build your site, please send a plan request before subscribing so I can review the site and confirm it is a good fit. Some platforms need a quick assessment first.',
  },
  {
    q: 'How do I cancel?',
    a: 'Use the billing portal link on this site any time. Your plan stays active until the end of the current billing period.',
  },
];
