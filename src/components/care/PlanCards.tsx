'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { plans, type Plan } from '@/content/maintenance';
import { billing } from '@/content/site';
import { buttonClass } from '@/components/ui/Button';

type Props = {
  /** "full" shows checkout controls; "preview" links to /maintenance. */
  mode?: 'full' | 'preview';
};

export function PlanCards({ mode = 'full' }: Props) {
  return (
    <ul className='grid gap-6 lg:grid-cols-3 lg:items-stretch'>
      {plans.map(plan => (
        <li key={plan.id} className='flex'>
          <PlanCard plan={plan} mode={mode} />
        </li>
      ))}
    </ul>
  );
}

function PlanCard({ plan, mode }: { plan: Plan; mode: 'full' | 'preview' }) {
  const featured = plan.featured;
  return (
    <article
      aria-labelledby={`plan-${plan.id}`}
      className={`relative flex w-full flex-col rounded-lg p-7 ${
        featured ? 'on-dark bg-ink text-white ring-1 ring-ink' : 'bg-white ring-1 ring-line'
      }`}
    >
      {featured && (
        <p className='absolute -top-3 left-7 rounded-sm bg-sage px-2.5 py-1 text-xs font-semibold text-ink'>
          Best fit for most small businesses
        </p>
      )}
      <h3 id={`plan-${plan.id}`} className='text-h3 font-semibold'>
        {plan.name}
      </h3>
      <p className={`mt-2 ${featured ? 'text-mist' : 'text-slate'}`}>{plan.audience}</p>
      <p className='mt-6 flex items-baseline gap-1.5'>
        <span className='font-display text-5xl font-semibold tracking-tight'>${plan.price}</span>
        <span className={featured ? 'text-mist' : 'text-slate'}>per month</span>
      </p>
      <p className={`mt-2 text-sm font-semibold ${featured ? 'text-sage' : 'text-spruce'}`}>
        {plan.editingAllowance} total editing time each month
      </p>

      <div className={`my-6 h-px ${featured ? 'bg-line-dark' : 'bg-line'}`} />

      {plan.inheritsFrom && (
        <p className={`mb-3 text-sm font-semibold ${featured ? 'text-white' : 'text-ink'}`}>{plan.inheritsFrom}</p>
      )}
      <ul className='flex-1 space-y-3'>
        {plan.features.map(f => (
          <li key={f} className='flex gap-3'>
            <Check size={18} aria-hidden className={`mt-0.5 shrink-0 ${featured ? 'text-sage' : 'text-spruce'}`} />
            <span className={featured ? 'text-mist' : 'text-slate'}>{f}</span>
          </li>
        ))}
      </ul>

      <div className='mt-8'>
        {mode === 'preview' ? (
          <Link
            href={`/maintenance#plan-${plan.id}-cta`}
            className={buttonClass(featured ? 'light' : 'secondary', 'w-full')}
          >
            See {plan.name} details
          </Link>
        ) : (
          <PlanCheckout plan={plan} />
        )}
      </div>
    </article>
  );
}

function PlanCheckout({ plan }: { plan: Plan }) {
  const link = billing.paymentLinks[plan.id];
  const [step, setStep] = useState<'idle' | 'confirm'>('idle');
  const [accepted, setAccepted] = useState(false);
  const checkboxId = useId();
  const checkboxRef = useRef<HTMLInputElement>(null);
  // The subscribe button unmounts on click; keep keyboard focus in the flow.
  useEffect(() => {
    if (step === 'confirm') checkboxRef.current?.focus();
  }, [step]);
  const reduce = useReducedMotion();
  const featured = plan.featured;
  const requestHref = `/contact?service=${encodeURIComponent('Monthly website care')}&plan=${plan.id}`;

  // No Stripe link configured yet: honest fallback to a plan request.
  if (!link) {
    return (
      <div id={`plan-${plan.id}-cta`}>
        <Link href={requestHref} className={buttonClass(featured ? 'light' : 'primary', 'w-full')}>
          Request {plan.name}
        </Link>
        <p className={`mt-3 text-sm ${featured ? 'text-mist' : 'text-slate'}`}>
          Online signup is not open yet. Send a request and I will reply with a secure Stripe checkout link.
        </p>
      </div>
    );
  }

  return (
    <div id={`plan-${plan.id}-cta`}>
      {step === 'idle' && (
        <button
          type='button'
          onClick={() => setStep('confirm')}
          className={buttonClass(featured ? 'light' : 'primary', 'w-full')}
        >
          Subscribe to {plan.name}
        </button>
      )}
      <AnimatePresence initial={false}>
        {step === 'confirm' && (
          <motion.div
            key='confirm'
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className='overflow-hidden'
          >
            <div className={`rounded-md p-4 ${featured ? 'bg-ink-soft' : 'bg-sky'}`}>
              <p className='font-semibold'>Before you subscribe</p>
              <div className='mt-3 flex gap-3'>
                <input
                  id={checkboxId}
                  ref={checkboxRef}
                  type='checkbox'
                  checked={accepted}
                  onChange={e => setAccepted(e.target.checked)}
                  className='mt-1 h-5 w-5 shrink-0 accent-spruce'
                />
                <label htmlFor={checkboxId} className={`text-sm leading-relaxed ${featured ? 'text-mist' : 'text-slate'}`}>
                  I have read the{' '}
                  <a href='#plan-terms' className='underline underline-offset-2'>
                    plan terms
                  </a>
                  . I understand {plan.editingAllowance} is my total monthly editing time, unused time does not roll over,
                  and the plan renews at ${plan.price}/month until I cancel.
                </label>
              </div>
              {accepted ? (
                <a href={link} className={buttonClass(featured ? 'light' : 'primary', 'mt-4 w-full')}>
                  Continue to secure checkout
                </a>
              ) : (
                <button type='button' disabled className={buttonClass(featured ? 'light' : 'primary', 'mt-4 w-full')}>
                  Continue to secure checkout
                </button>
              )}
              <p className={`mt-3 text-xs ${featured ? 'text-mist' : 'text-slate'}`}>
                Payment is handled by Stripe. Card details never touch this website.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
