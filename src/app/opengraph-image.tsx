import { ImageResponse } from 'next/og';
import { site } from '@/content/site';

export const alt = `${site.businessName} — web design and front-end development in Colorado Springs`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#1b2430',
          color: '#ffffff',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: '#ffffff',
              color: '#1b2430',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            JS
          </div>
          <div style={{ fontSize: 30, color: '#a9b3bf' }}>{site.businessName}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, maxWidth: 980 }}>
            Websites that make your business look as good as the work you do.
          </div>
          <div style={{ fontSize: 30, color: '#8fd1c7', marginTop: 28 }}>
            Web design, front-end development and website care in Colorado Springs
          </div>
        </div>
      </div>
    ),
    size,
  );
}
