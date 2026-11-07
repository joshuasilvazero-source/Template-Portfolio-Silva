import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { billing, site } from '@/content/site';

/**
 * Stripe Payment Links redirect here after checkout (configure the
 * "After payment" URL in Stripe). Visiting this page does NOT prove a payment
 * happened — Stripe's receipt and dashboard are the source of truth — so the
 * copy never says the plan is active.
 */
export const metadata: Metadata = {
  title: 'Thanks for subscribing',
  robots: { index: false, follow: false },
};

export default function WelcomePage() {
  return (
    <section className='bg-white pb-24 pt-32 md:pt-40'>
      <div className='container-site max-w-3xl'>
        <h1 className='text-h1 font-semibold'>Thanks — here is what happens next.</h1>
        <div className='prose-site mt-8'>
          <p>
            If your checkout completed, Stripe has emailed a receipt to the address you entered. Your plan begins once Stripe
            confirms the payment.
          </p>
          <h2>Next steps</h2>
          <ul>
            <li>I will contact you within {site.responseTime} to confirm your website details and how to send requests.</li>
            <li>Keep your Stripe receipt — it includes your billing details and invoice.</li>
            <li>
              If you did not receive a receipt, the payment may not have gone through. Email{' '}
              <a href={`mailto:${site.email}`}>{site.email}</a> and I will check.
            </li>
          </ul>
        </div>
        <div className='mt-10 flex flex-wrap gap-3'>
          <ButtonLink href='/'>Back to home</ButtonLink>
          {billing.customerPortal && (
            <a href={billing.customerPortal} className='inline-flex min-h-12 items-center px-2 font-semibold text-spruce underline underline-offset-4'>
              Manage billing
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
