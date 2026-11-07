/** "JS" monogram over a single contour line — the site's mark. */
export function Monogram({ size = 40, light = false }: { size?: number; light?: boolean }) {
  return (
    <svg width={size} height={size} viewBox='0 0 40 40' aria-hidden focusable='false'>
      <rect width='40' height='40' rx='10' fill={light ? '#ffffff' : '#1b2430'} />
      <path
        d='M5 29c5-3 8-9 13-9s6 5 9 5 5-4 8-6'
        fill='none'
        stroke={light ? '#0f6e66' : '#8fd1c7'}
        strokeWidth='1.6'
        strokeLinecap='round'
      />
      <text
        x='20'
        y='22'
        textAnchor='middle'
        fontFamily='var(--font-bricolage), sans-serif'
        fontWeight='700'
        fontSize='14'
        fill={light ? '#1b2430' : '#ffffff'}
      >
        JS
      </text>
    </svg>
  );
}
