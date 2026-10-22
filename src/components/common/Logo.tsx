import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  subtitle?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showWordmark = true,
  subtitle,
  className = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', svg: 'w-5 h-5', text: 'text-base', sub: 'text-[9px]' },
    md: { box: 'w-10 h-10', svg: 'w-6 h-6', text: 'text-lg', sub: 'text-[10px]' },
    lg: { box: 'w-14 h-14', svg: 'w-8 h-8', text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 'w-20 h-20', svg: 'w-11 h-11', text: 'text-3xl', sub: 'text-sm' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Knowledge Nexus Mark Container */}
      <div
        className={`relative ${current.box} rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-emerald-600 p-[1.5px] shadow-sm shadow-blue-900/10 transition-transform duration-300 hover:scale-105 shrink-0`}
      >
        {/* Soft inner bevel */}
        <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-slate-950/20 to-transparent flex items-center justify-center p-1.5">
          {/* Custom Knowledge Nexus SVG Mark */}
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${current.svg} drop-shadow-xs`}
          >
            <defs>
              {/* Blue Gradient */}
              <linearGradient id="logoBlueGrad" x1="6" y1="10" x2="24" y2="38" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#93C5FD" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>

              {/* Green Gradient */}
              <linearGradient id="logoGreenGrad" x1="42" y1="10" x2="24" y2="38" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6EE7B7" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              {/* Central Spark Glow */}
              <radialGradient id="sparkGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#F0FDF4" />
                <stop offset="100%" stopColor="#A7F3D0" />
              </radialGradient>
            </defs>

            {/* Knowledge Archetype: Left Book / Intellect Wing (Blue) */}
            <path
              d="M24 38C20 34.5 13 32.5 8 33.5V13.5C13 12.5 20 14.5 24 18V38Z"
              fill="url(#logoBlueGrad)"
              fillOpacity="0.95"
            />

            {/* Knowledge Archetype: Right Book / Discovery Wing (Green) */}
            <path
              d="M24 38C28 34.5 35 32.5 40 33.5V13.5C35 12.5 28 14.5 24 18V38Z"
              fill="url(#logoGreenGrad)"
              fillOpacity="0.95"
            />

            {/* Intersecting Collaborative Bridge Spine */}
            <path
              d="M24 18V38"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Neural Connection Node 1 (Student / Left) */}
            <circle cx="14" cy="22" r="2.5" fill="#FFFFFF" />
            <path d="M14 22L24 28" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="1.5 1.5" strokeOpacity="0.8" />

            {/* Neural Connection Node 2 (Faculty / Right) */}
            <circle cx="34" cy="22" r="2.5" fill="#FFFFFF" />
            <path d="M34 22L24 28" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="1.5 1.5" strokeOpacity="0.8" />

            {/* Center Nexus Node of Collaboration */}
            <circle cx="24" cy="28" r="3" fill="#FFFFFF" />

            {/* Top Beacon of Intellect & Spark of Enlightenment */}
            <path
              d="M24 6L25.8 10.2L30 12L25.8 13.8L24 18L22.2 13.8L18 12L22.2 10.2L24 6Z"
              fill="url(#sparkGlow)"
            />
          </svg>
        </div>

        {/* Ambient subtle ping / beacon accent */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white shadow-xs" />
      </div>

      {/* Wordmark and Subtitle */}
      {showWordmark && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1 leading-none">
            <span className={`${current.text} font-black tracking-tight text-slate-900`}>
              Project
            </span>
            <span className={`${current.text} font-black tracking-tight text-blue-600`}>
              Connect
            </span>
          </div>

          {subtitle && (
            <span
              className={`${current.sub} font-semibold uppercase tracking-wider text-slate-500 mt-1`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
