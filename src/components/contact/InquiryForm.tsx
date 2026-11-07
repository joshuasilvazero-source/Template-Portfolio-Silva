'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { INQUIRY_SERVICES } from '@/content/services';
import { plans } from '@/content/maintenance';
import { site } from '@/content/site';
import {
  BUDGETS,
  CARE_INTEREST,
  LIMITS,
  PLAN_IDS,
  TIMELINES,
  normalizeInquiry,
  validateInquiry,
  type Inquiry,
  type InquiryErrors,
} from '@/lib/inquiry';
import { buttonClass } from '@/components/ui/Button';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const FIELD_ORDER: (keyof Inquiry)[] = ['name', 'business', 'email', 'website', 'service', 'budget', 'timeline', 'message', 'care'];

const inputClass = (invalid: boolean) =>
  `mt-2 block w-full rounded-md border bg-white px-4 py-3 text-base text-ink placeholder:text-slate/70 ${
    invalid ? 'border-alert ring-1 ring-alert' : 'border-ink/20 hover:border-ink/40'
  }`;

export function InquiryForm() {
  const params = useSearchParams();
  const presetService = params.get('service') ?? '';
  const presetPlan = params.get('plan') ?? '';
  const validService = (INQUIRY_SERVICES as readonly string[]).includes(presetService) ? presetService : '';
  const validPlan = (PLAN_IDS as readonly string[]).includes(presetPlan) ? presetPlan : '';
  const planName = plans.find(p => p.id === validPlan)?.name;

  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [serverError, setServerError] = useState('');
  const startedAt = useRef<number>(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const data = normalizeInquiry(raw);
    const found = validateInquiry(data);
    setErrors(found);
    setServerError('');

    if (Object.keys(found).length) {
      setStatus('idle');
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, fax: raw.fax ?? '', elapsed: Date.now() - startedAt.current }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; fields?: InquiryErrors };
      if (!res.ok) {
        if (body.fields) setErrors(body.fields);
        throw new Error(body.error || 'The message could not be sent.');
      }
      setStatus('success');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'The message could not be sent.');
      setStatus('error');
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }

  if (status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role='status'
        className='rounded-lg bg-white p-8 ring-1 ring-line md:p-10'
      >
        <CheckCircle2 size={36} className='text-spruce' aria-hidden />
        <h2 className='mt-4 text-h2 font-semibold'>Thanks — your inquiry is in.</h2>
        <p className='mt-4 max-w-xl text-lead text-slate'>
          I will reply within {site.responseTime} (during {site.hours}). A confirmation email is on its way to you now — check
          your spam folder if you do not see it.
        </p>
        <p className='mt-6 text-slate'>
          While you wait, you can <Link href='/work' className='font-semibold text-spruce underline underline-offset-4'>look through recent work</Link> or{' '}
          <Link href='/faq' className='font-semibold text-spruce underline underline-offset-4'>read common questions</Link>.
        </p>
      </div>
    );
  }

  const errorList = FIELD_ORDER.filter(k => errors[k]);
  const showSummary = errorList.length > 0 || status === 'error';
  const err = (k: keyof Inquiry) => errors[k];
  const describe = (k: keyof Inquiry, hint?: boolean) =>
    [hint ? `${k}-hint` : '', errors[k] ? `${k}-error` : ''].filter(Boolean).join(' ') || undefined;

  return (
    <form onSubmit={onSubmit} noValidate className='relative rounded-lg bg-white p-6 ring-1 ring-line sm:p-8 md:p-10' aria-describedby='form-intro'>
      <p id='form-intro' className='text-slate'>
        Fields marked <span aria-hidden>*</span>
        <span className='sr-only'>with an asterisk</span> are required.
      </p>

      {showSummary && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role='alert'
          className='mt-6 rounded-md border border-alert/40 bg-alert-tint p-4 text-alert'
        >
          {status === 'error' && !errorList.length ? (
            <p className='font-semibold'>
              {serverError} You can also email me directly at{' '}
              <a href={`mailto:${site.email}`} className='underline'>
                {site.email}
              </a>
              .
            </p>
          ) : (
            <>
              <p className='font-semibold'>Please fix {errorList.length === 1 ? 'this field' : `these ${errorList.length} fields`}:</p>
              <ul className='mt-2 list-disc pl-5'>
                {errorList.map(k => (
                  <li key={k}>
                    <a href={`#${k}`} className='underline'>
                      {errors[k]}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {planName && (
        <p className='mt-6 rounded-md bg-spruce-tint p-4 text-ink'>
          You are requesting the <strong>{planName}</strong> plan. I will review your site and send a secure Stripe checkout link.
        </p>
      )}
      <input type='hidden' name='plan' value={validPlan} />

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden className='absolute left-[-10000px] h-px w-px overflow-hidden'>
        <label htmlFor='fax'>Leave this field empty</label>
        <input id='fax' name='fax' type='text' tabIndex={-1} autoComplete='off' />
      </div>

      <div className='mt-8 grid gap-6 sm:grid-cols-2'>
        <Field id='name' label='Your name' required error={err('name')}>
          <input id='name' name='name' type='text' autoComplete='name' maxLength={LIMITS.name} required aria-invalid={!!err('name')} aria-describedby={describe('name')} className={inputClass(!!err('name'))} />
        </Field>
        <Field id='business' label='Business name' error={err('business')}>
          <input id='business' name='business' type='text' autoComplete='organization' maxLength={LIMITS.business} aria-invalid={!!err('business')} aria-describedby={describe('business')} className={inputClass(!!err('business'))} />
        </Field>
        <Field id='email' label='Email address' required error={err('email')}>
          <input id='email' name='email' type='email' autoComplete='email' maxLength={LIMITS.email} required aria-invalid={!!err('email')} aria-describedby={describe('email')} className={inputClass(!!err('email'))} />
        </Field>
        <Field id='website' label='Current website' hint='If you have one.' error={err('website')}>
          <input id='website' name='website' type='text' inputMode='url' autoComplete='url' placeholder='example.com' maxLength={LIMITS.website} aria-invalid={!!err('website')} aria-describedby={describe('website', true)} className={inputClass(!!err('website'))} />
        </Field>

        <Field id='service' label='What do you need?' required error={err('service')}>
          <select id='service' name='service' required defaultValue={validService} aria-invalid={!!err('service')} aria-describedby={describe('service')} className={inputClass(!!err('service'))}>
            <option value='' disabled>
              Choose a service
            </option>
            {INQUIRY_SERVICES.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field id='budget' label='Estimated budget' required error={err('budget')}>
          <select id='budget' name='budget' required defaultValue={validPlan ? 'Not sure yet' : ''} aria-invalid={!!err('budget')} aria-describedby={describe('budget')} className={inputClass(!!err('budget'))}>
            <option value='' disabled>
              Choose a range
            </option>
            {BUDGETS.map(b => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </Field>
        <Field id='timeline' label='Desired timeline' required error={err('timeline')}>
          <select id='timeline' name='timeline' required defaultValue='' aria-invalid={!!err('timeline')} aria-describedby={describe('timeline')} className={inputClass(!!err('timeline'))}>
            <option value='' disabled>
              Choose a timeline
            </option>
            {TIMELINES.map(t => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>

        <fieldset className='sm:col-span-2' aria-describedby={err('care') ? 'care-error' : undefined}>
          <legend className='font-semibold text-ink'>Interested in a monthly website care plan?</legend>
          <div className='mt-3 flex flex-wrap gap-3'>
            {CARE_INTEREST.map(c => (
              <label key={c} className='flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-ink/20 px-4 has-[:checked]:border-spruce has-[:checked]:bg-spruce-tint'>
                <input type='radio' name='care' value={c} defaultChecked={!!validPlan && c === 'Yes'} className='h-4 w-4 accent-spruce' />
                {c}
              </label>
            ))}
          </div>
          {err('care') && (
            <p id='care-error' className='mt-2 text-sm font-semibold text-alert'>
              {err('care')}
            </p>
          )}
        </fieldset>

        <Field id='message' label='Tell me about your project' required hint='What does your business do, and what should the website help with?' error={err('message')} className='sm:col-span-2'>
          <textarea id='message' name='message' rows={6} maxLength={LIMITS.message} required aria-invalid={!!err('message')} aria-describedby={describe('message', true)} className={inputClass(!!err('message'))} />
        </Field>
      </div>

      <p className='mt-6 max-w-2xl text-sm leading-relaxed text-slate'>
        Your details are emailed to me and used only to reply to your inquiry. They are not sold, shared, or added to a mailing list.
        See the <Link href='/privacy' className='underline underline-offset-2'>privacy notice</Link>.
      </p>

      <button type='submit' disabled={status === 'submitting'} className={buttonClass('primary', 'mt-6 w-full sm:w-auto')}>
        {status === 'submitting' ? 'Sending…' : 'Send inquiry'}
      </button>
      <p className='sr-only' aria-live='polite'>
        {status === 'submitting' ? 'Sending your inquiry.' : ''}
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  className = '',
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className='font-semibold text-ink'>
        {label}
        {required && <span aria-hidden className='text-alert'> *</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className='mt-1 text-sm text-slate'>
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className='mt-2 text-sm font-semibold text-alert'>
          {error}
        </p>
      )}
    </div>
  );
}
