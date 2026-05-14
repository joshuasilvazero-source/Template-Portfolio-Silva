'use client';

export const LogoSvg = ({
  size = 48,
  animated = false,
  className = '',
}: {
  size?: number;
  animated?: boolean;
  className?: string;
}) => {
  const animationClass = animated ? 'animate-pulse-glow' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 200 200'
      className={`${animationClass} ${className}`}
      style={{
        filter: animated
          ? 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))'
          : 'none',
      }}
    >
      <defs>
        <linearGradient id='jsGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#00ffff' stopOpacity='1' />
          <stop offset='50%' stopColor='#ff00ff' stopOpacity='1' />
          <stop offset='100%' stopColor='#00ff00' stopOpacity='1' />
        </linearGradient>

        <filter id='glow'>
          <feGaussianBlur stdDeviation='3' result='coloredBlur' />
          <feMerge>
            <feMergeNode in='coloredBlur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>

        <filter id='glitch'>
          <feTurbulence
            type='fractalNoise'
            baseFrequency='0.9'
            numOctaves='4'
            result='noise'
            seed='2'
          />
          <feDisplacementMap in='SourceGraphic' in2='noise' scale='2' />
        </filter>
      </defs>

      {/* Outer hexagon frame */}
      <g filter='url(#glow)'>
        <polygon
          points='100,20 170,55 170,145 100,180 30,145 30,55'
          fill='none'
          stroke='url(#jsGradient)'
          strokeWidth='3'
          opacity='0.8'
        />
      </g>

      {/* Inner technical grid */}
      <g opacity='0.4' stroke='url(#jsGradient)' strokeWidth='1'>
        <line x1='100' y1='50' x2='100' y2='150' />
        <line x1='70' y1='65' x2='130' y2='135' />
        <line x1='130' y1='65' x2='70' y2='135' />
      </g>

      {/* "J" Letter with technical styling */}
      <g filter='url(#glow)'>
        <text
          x='60'
          y='135'
          fontSize='80'
          fontWeight='900'
          fill='url(#jsGradient)'
          fontFamily="'Courier New', monospace"
          letterSpacing='-5'
        >
          J
        </text>
      </g>

      {/* "S" Letter with technical styling */}
      <g filter='url(#glow)'>
        <text
          x='100'
          y='135'
          fontSize='80'
          fontWeight='900'
          fill='url(#jsGradient)'
          fontFamily="'Courier New', monospace"
          letterSpacing='-5'
        >
          S
        </text>
      </g>

      {/* Neon corner accents */}
      <g stroke='#00ffff' strokeWidth='2' opacity='0.7'>
        {/* Top-left accent */}
        <line x1='30' y1='55' x2='50' y2='55' />
        <line x1='30' y1='55' x2='30' y2='75' />

        {/* Top-right accent */}
        <line x1='170' y1='55' x2='150' y2='55' />
        <line x1='170' y1='55' x2='170' y2='75' />

        {/* Bottom-left accent */}
        <line x1='30' y1='145' x2='50' y2='145' />
        <line x1='30' y1='145' x2='30' y2='125' />

        {/* Bottom-right accent */}
        <line x1='170' y1='145' x2='150' y2='145' />
        <line x1='170' y1='145' x2='170' y2='125' />
      </g>

      {/* Animated pulse circle (optional) */}
      {animated && (
        <circle
          cx='100'
          cy='100'
          r='90'
          fill='none'
          stroke='url(#jsGradient)'
          strokeWidth='1'
          opacity='0.3'
          style={{
            animation: 'pulse-circle 2s ease-in-out infinite',
          }}
        />
      )}

      <style jsx>{`
        @keyframes pulse-circle {
          0%,
          100% {
            r: 85;
            opacity: 0.3;
          }
          50% {
            r: 95;
            opacity: 0.1;
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.6));
          }
          50% {
            filter: drop-shadow(0 0 16px rgba(255, 0, 255, 0.8));
          }
        }
      `}</style>
    </svg>
  );
};

/**
 * Horizontal Logo Variant for navbar
 */
export const LogoHorizontalSvg = ({
  height = 40,
  className = '',
}: {
  height?: number;
  className?: string;
}) => {
  const width = Math.round(height * 2.5);

  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 300 120'
      className={className}
      style={{
        filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.4))',
      }}
    >
      <defs>
        <linearGradient
          id='jsGradientHorizontal'
          x1='0%'
          y1='0%'
          x2='100%'
          y2='0%'
        >
          <stop offset='0%' stopColor='#00ffff' />
          <stop offset='50%' stopColor='#ff00ff' />
          <stop offset='100%' stopColor='#00ff00' />
        </linearGradient>

        <filter id='glowHorizontal'>
          <feGaussianBlur stdDeviation='2' result='coloredBlur' />
          <feMerge>
            <feMergeNode in='coloredBlur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>

      {/* Logo mark */}
      <g filter='url(#glowHorizontal)'>
        <polygon
          points='60,20 90,35 90,85 60,100 30,85 30,35'
          fill='none'
          stroke='url(#jsGradientHorizontal)'
          strokeWidth='2'
          opacity='0.9'
        />
      </g>

      {/* JS initials inside */}
      <text
        x='60'
        y='75'
        fontSize='36'
        fontWeight='900'
        fill='url(#jsGradientHorizontal)'
        fontFamily="'Courier New', monospace"
        textAnchor='middle'
      >
        JS
      </text>

      {/* Text "Joshua Silva" */}
      <text
        x='130'
        y='50'
        fontSize='18'
        fontWeight='700'
        fill='#00ffff'
        fontFamily="'Courier New', monospace"
        letterSpacing='1'
      >
        JOSHUA
      </text>

      <text
        x='130'
        y='75'
        fontSize='18'
        fontWeight='700'
        fill='#ff00ff'
        fontFamily="'Courier New', monospace"
        letterSpacing='1'
      >
        SILVA
      </text>

      {/* Decorative line */}
      <line
        x1='115'
        y1='60'
        x2='280'
        y2='60'
        stroke='url(#jsGradientHorizontal)'
        strokeWidth='1'
        opacity='0.5'
      />
    </svg>
  );
};
