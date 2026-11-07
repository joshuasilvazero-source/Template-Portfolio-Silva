import type { Metadata } from 'next';
import { site } from '@/content/site';

/**
 * LAUNCH CHECK: this notice describes how the site actually handles data today.
 * Have it reviewed by a qualified professional before launch, and update it if
 * you add analytics, cookies, a newsletter, or another form provider.
 */
export const metadata: Metadata = {
  title: 'Privacy Notice',
  description: `How ${site.businessName} handles information submitted through this website.`,
  alternates: { canonical: '/privacy' },
};

const updated = 'November 5, 2026';

export default function PrivacyPage() {
  return (
    <section className='bg-white pb-24 pt-32 md:pt-40'>
      <div className='container-site'>
        <h1 className='text-h1 font-semibold'>Privacy notice</h1>
        <p className='mt-3 text-slate'>Last updated {updated}</p>
        <div className='prose-site mt-10'>
          <p>
            This website is operated by {site.name}, an independent freelance web designer in {site.location}. This notice explains
            what information the site collects and how it is used.
          </p>

          <h2>Information you send through the contact form</h2>
          <p>
            When you submit a project inquiry, the details you enter — your name, business name, email address, website, the service
            you are interested in, budget, timeline, and project description — are sent to my email inbox. I use them only to reply
            to you and to prepare a proposal if you ask for one. A confirmation email is sent to the address you provide.
          </p>
          <p>
            Email is delivered through Google (Gmail). I do not sell, rent, or share your information, and I do not add you to a
            mailing list.
          </p>

          <h2>Payments</h2>
          <p>
            Care plan subscriptions are processed by Stripe on Stripe-hosted pages. Your card details go directly to Stripe and are
            never sent to or stored on this website. Stripe shares your name, email, and subscription status with me so I can
            provide the service. See{' '}
            <a href='https://stripe.com/privacy' target='_blank' rel='noopener noreferrer'>
              Stripe’s privacy policy
            </a>
            .
          </p>

          <h2>Hosting and technical data</h2>
          <p>
            This site is hosted on Vercel, which may process technical information such as IP addresses and browser type in server
            logs to deliver and secure the site. The contact form uses your IP address briefly to limit spam. This site does not use
            analytics, advertising trackers, or tracking cookies.
          </p>

          <h2>How long information is kept</h2>
          <p>
            Inquiry emails are kept as long as needed to respond and for ordinary business records. You can ask me to delete them
            at any time.
          </p>

          <h2>Your choices</h2>
          <p>
            To ask what information I have about you, or to have it corrected or deleted, email{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
