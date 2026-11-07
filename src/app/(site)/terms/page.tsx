import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/content/site';

/**
 * Intentionally does not publish full legal terms. Draft agreements live in
 * docs/business/ and must be professionally reviewed before they are published
 * or signed. This page points visitors to where terms are actually defined.
 */
export const metadata: Metadata = {
  title: 'Terms',
  description: `Where project and care plan terms for ${site.businessName} are defined.`,
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <section className='bg-white pb-24 pt-32 md:pt-40'>
      <div className='container-site'>
        <h1 className='text-h1 font-semibold'>Terms</h1>
        <div className='prose-site mt-10'>
          <h2>Website projects</h2>
          <p>
            Prices shown on this site are starting ranges, not binding quotes. Every website project is governed by a written
            proposal and a signed agreement that set out the scope, deliverables, price, payment schedule, revision rounds, and
            ownership. No work begins and nothing is billed until you approve that agreement.
          </p>

          <h2>Website care plans</h2>
          <p>
            What each care plan includes, its monthly editing time, exclusions, billing, and cancellation are listed in the{' '}
            <Link href='/maintenance#plan-terms'>care plan terms</Link>. You confirm you have read them before checkout. Billing is
            handled by Stripe, and you can cancel at any time from the billing portal.
          </p>

          <h2>Privacy</h2>
          <p>
            See the <Link href='/privacy'>privacy notice</Link> for how information you submit is handled.
          </p>

          <h2>Questions</h2>
          <p>
            Email <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
