import type { VisualKind } from '@/content/work';

/**
 * Original schematic illustrations of the TYPE of interface worked on.
 * These are not client screenshots and contain no client branding or code.
 */

const INK = '#1b2430';
const LINE = '#cfd6dd';
const FILL = '#e9edf1';
const ACCENT = '#0f6e66';
const TINT = '#e3f0ee';

function Frame({ children, mobile = false }: { children: React.ReactNode; mobile?: boolean }) {
  return mobile ? (
    <g>
      <rect x='190' y='14' width='140' height='252' rx='18' fill='#fff' stroke={LINE} />
      <rect x='240' y='24' width='40' height='5' rx='2.5' fill={FILL} />
      <g transform='translate(202 40)'>{children}</g>
    </g>
  ) : (
    <g>
      <rect x='20' y='14' width='480' height='252' rx='12' fill='#fff' stroke={LINE} />
      <path d='M20 40h480' stroke={LINE} />
      <circle cx='38' cy='27' r='4' fill={LINE} />
      <circle cx='52' cy='27' r='4' fill={LINE} />
      <circle cx='66' cy='27' r='4' fill={LINE} />
      <g transform='translate(36 54)'>{children}</g>
    </g>
  );
}

const bar = (x: number, y: number, w: number, h = 7, fill = FILL) => (
  <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} />
);

const visuals: Record<VisualKind, React.ReactNode> = {
  search: (
    <Frame mobile>
      <rect x='0' y='0' width='116' height='26' rx='8' fill={TINT} stroke={ACCENT} />
      {bar(10, 10, 60, 6, ACCENT)}
      <rect x='0' y='34' width='54' height='18' rx='9' fill={INK} />
      <rect x='60' y='34' width='56' height='18' rx='9' fill='#fff' stroke={LINE} />
      {[64, 120, 176].map(y => (
        <g key={y}>
          <rect x='0' y={y} width='116' height='48' rx='8' fill='#fff' stroke={LINE} />
          <rect x='6' y={y + 6} width='36' height='36' rx='6' fill={FILL} />
          {bar(50, y + 10, 56)}
          {bar(50, y + 22, 38)}
          {bar(50, y + 34, 26, 6, ACCENT)}
        </g>
      ))}
    </Frame>
  ),
  'product-cards': (
    <Frame>
      {[0, 1, 2, 3].map(i => (
        <g key={i} transform={`translate(${i * 112} 0)`}>
          <rect width='100' height='190' rx='10' fill='#fff' stroke={i === 1 ? ACCENT : LINE} strokeWidth={i === 1 ? 1.5 : 1} />
          <rect x='8' y='8' width='84' height='92' rx='6' fill={FILL} />
          {bar(10, 112, 70)}
          {bar(10, 126, 46)}
          {i === 2 ? (
            <rect x='10' y='150' width='80' height='26' rx='6' fill='#fff' stroke={LINE} strokeDasharray='4 3' />
          ) : (
            <rect x='10' y='150' width='80' height='26' rx='6' fill={i === 1 ? ACCENT : INK} />
          )}
          {i === 2 && bar(26, 160, 48, 6, LINE)}
        </g>
      ))}
    </Frame>
  ),
  checkout: (
    <Frame>
      <rect x='0' y='0' width='70' height='190' rx='8' fill={FILL} />
      {[14, 34, 54, 74].map(y => <g key={y}>{bar(10, y, y === 34 ? 50 : 40, 7, y === 34 ? ACCENT : LINE)}</g>)}
      {[0, 1, 2].map(i => (
        <g key={i} transform={`translate(84 ${i * 40})`}>
          <rect width='220' height='32' rx='6' fill='#fff' stroke={LINE} />
          <rect x='8' y='8' width='16' height='16' rx='3' fill={FILL} />
          {bar(32, 12, 90)}
          {bar(176, 12, 34, 7, INK)}
        </g>
      ))}
      <rect x='318' y='0' width='130' height='190' rx='10' fill={TINT} stroke={ACCENT} />
      {bar(330, 16, 70, 8, INK)}
      {[40, 56, 72].map(y => (
        <g key={y}>
          {bar(330, y, 50)}
          {bar(400, y, 34)}
        </g>
      ))}
      <path d='M330 92h106' stroke={ACCENT} strokeOpacity='.4' />
      <rect x='330' y='146' width='106' height='30' rx='6' fill={ACCENT} />
    </Frame>
  ),
  category: (
    <Frame mobile>
      {bar(0, 2, 70, 9, INK)}
      {[24, 58, 92].map((y, i) => (
        <g key={y}>
          <rect x='0' y={y} width='116' height={i === 0 ? 30 : 28} rx='6' fill={i === 0 ? TINT : '#fff'} stroke={i === 0 ? ACCENT : LINE} />
          {bar(8, y + 11, 54, 6, i === 0 ? ACCENT : FILL)}
          {bar(96, y + 11, 12, 6, LINE)}
        </g>
      ))}
      {[0, 1].map(c =>
        [128, 182].map(y => (
          <g key={`${c}-${y}`}>
            <rect x={c * 60} y={y} width='56' height='48' rx='6' fill='#fff' stroke={LINE} />
            <rect x={c * 60 + 5} y={y + 5} width='46' height='24' rx='4' fill={FILL} />
            {bar(c * 60 + 6, y + 35, 34, 5)}
          </g>
        )),
      )}
    </Frame>
  ),
  'product-page': (
    <Frame>
      <rect x='0' y='0' width='200' height='190' rx='10' fill={FILL} />
      {bar(222, 6, 160, 12, INK)}
      {bar(222, 28, 80, 8, ACCENT)}
      {bar(222, 52, 200)}
      {bar(222, 66, 170)}
      {[0, 1, 2].map(i => (
        <rect key={i} x={222 + i * 58} y='90' width='50' height='30' rx='6' fill={i === 0 ? TINT : '#fff'} stroke={i === 0 ? ACCENT : LINE} strokeWidth={i === 0 ? 1.5 : 1} />
      ))}
      <rect x='222' y='132' width='70' height='30' rx='6' fill='#fff' stroke={LINE} />
      {bar(236, 143, 12, 8, INK)}
      {bar(266, 143, 12, 8, INK)}
      <rect x='300' y='132' width='126' height='30' rx='6' fill={ACCENT} />
    </Frame>
  ),
};

export function CaseVisual({ kind, label }: { kind: VisualKind; label: string }) {
  return (
    <figure className='m-0'>
      <svg viewBox='0 0 520 280' className='h-auto w-full' role='img' aria-label={label}>
        <rect width='520' height='280' fill='#f3f5f7' />
        {visuals[kind]}
      </svg>
    </figure>
  );
}
