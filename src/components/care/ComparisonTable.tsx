import { Check, Minus } from 'lucide-react';
import { comparisonRows, plans } from '@/content/maintenance';

export function ComparisonTable() {
  return (
    <div className='relative overflow-x-auto rounded-lg bg-white ring-1 ring-line' tabIndex={0} role='region' aria-label='Plan comparison, scrollable'>
      <table className='w-full min-w-[40rem] border-collapse text-left'>
        <caption className='sr-only'>Comparison of website care plans</caption>
        <thead>
          <tr className='border-b border-line'>
            <th scope='col' className='p-4 text-sm font-semibold text-slate'>
              Feature
            </th>
            {plans.map(p => (
              <th key={p.id} scope='col' className={`p-4 font-display text-lg font-semibold ${p.featured ? 'bg-spruce-tint' : ''}`}>
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map(row => (
            <tr key={row.label} className='border-b border-line last:border-0'>
              <th scope='row' className='p-4 font-normal text-ink'>
                {row.label}
              </th>
              {plans.map(p => {
                const v = row.values[p.id];
                return (
                  <td key={p.id} className={`p-4 ${p.featured ? 'bg-spruce-tint/60' : ''}`}>
                    {v === true ? (
                      <>
                        <Check size={18} className='text-spruce' aria-hidden />
                        <span className='sr-only'>Included</span>
                      </>
                    ) : v === false ? (
                      <>
                        <Minus size={18} className='text-mist' aria-hidden />
                        <span className='sr-only'>Not included</span>
                      </>
                    ) : (
                      <span className='font-semibold'>{v}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
