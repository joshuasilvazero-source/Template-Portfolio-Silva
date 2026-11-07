import type { Metadata } from 'next';
import { RunnerGame } from '@/components/RunnerGame/RunnerGame';

/** Easter egg kept from the original portfolio. Not linked in navigation, not indexed. */
export const metadata: Metadata = {
  title: 'Play',
  robots: { index: false, follow: false },
};

export default function PlayPage() {
  return (
    <section className='on-dark bg-ink pb-16 pt-28 text-white'>
      <div className='container-site'>
        <h1 className='text-h2 font-semibold'>A small break</h1>
        <p className='mt-2 text-mist'>A side project from my original portfolio. Use the space bar or tap to play.</p>
        <div className='mt-8 overflow-hidden rounded-lg'>
          <RunnerGame />
        </div>
      </div>
    </section>
  );
}
