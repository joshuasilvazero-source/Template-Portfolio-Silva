import type { Faq } from '@/content/faq';

/** Native <details> accordion: keyboard and screen-reader accessible with no JS. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className='divide-y divide-line border-y border-line'>
      {items.map(item => (
        <details key={item.q} className='group'>
          <summary className='flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden'>
            {item.q}
            <span
              aria-hidden
              className='mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-slate transition-transform group-open:rotate-45'
            >
              +
            </span>
          </summary>
          <p className='max-w-[68ch] pb-6 leading-relaxed text-slate'>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
