import { useId } from 'react';

export default function SleepSnowmanFace({ isAsleep }) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      className={`sleep-face${isAsleep ? ' is-asleep' : ''}`}
      viewBox="0 0 200 200"
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <radialGradient id={`${uid}-snow`} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#f8fafc" />
          <stop offset="78%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#93c5fd" />
        </radialGradient>

        <radialGradient id={`${uid}-snowSleep`} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#faf5ff" />
          <stop offset="48%" stopColor="#ede9fe" />
          <stop offset="82%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </radialGradient>

        <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="rgba(30, 41, 59, 0)" />
          <stop offset="100%" stopColor="rgba(30, 58, 138, 0.22)" />
        </radialGradient>

        <linearGradient id={`${uid}-nose`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>

        <linearGradient id={`${uid}-iris`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        <filter id={`${uid}-cheek`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>

        <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      <circle
        cx="100"
        cy="100"
        r="96"
        fill={isAsleep ? `url(#${uid}-snowSleep)` : `url(#${uid}-snow)`}
      />

      <circle cx="100" cy="100" r="96" fill={`url(#${uid}-shadow)`} />

      <ellipse
        cx="100"
        cy="168"
        rx="62"
        ry="16"
        fill="rgba(15, 23, 42, 0.12)"
        filter={`url(#${uid}-soft)`}
      />

      <ellipse cx="58" cy="108" rx="14" ry="9" fill="rgba(251, 113, 133, 0.22)" filter={`url(#${uid}-cheek)`} />
      <ellipse cx="142" cy="108" rx="14" ry="9" fill="rgba(251, 113, 133, 0.22)" filter={`url(#${uid}-cheek)`} />

      <ellipse cx="62" cy="46" rx="28" ry="16" fill="rgba(255, 255, 255, 0.42)" />

      <g className={`sleep-face-eyes${isAsleep ? ' is-asleep' : ''}`}>
        <g className="sleep-face-eyes-open">
          <ellipse cx="72" cy="84" rx="13" ry="11" fill="#f8fafc" />
          <ellipse cx="128" cy="84" rx="13" ry="11" fill="#f8fafc" />
          <circle cx="72" cy="85" r="6.2" fill={`url(#${uid}-iris)`} />
          <circle cx="128" cy="85" r="6.2" fill={`url(#${uid}-iris)`} />
          <circle cx="72" cy="85" r="3.2" fill="#020617" />
          <circle cx="128" cy="85" r="3.2" fill="#020617" />
          <circle cx="74.2" cy="82.8" r="1.5" fill="#ffffff" />
          <circle cx="130.2" cy="82.8" r="1.5" fill="#ffffff" />
          <path
            d="M60 76 Q72 70 84 76"
            fill="none"
            stroke="rgba(51, 65, 85, 0.35)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M116 76 Q128 70 140 76"
            fill="none"
            stroke="rgba(51, 65, 85, 0.35)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        <g className="sleep-face-eyes-closed">
          <path
            d="M58 84 Q72 76 86 84"
            fill="none"
            stroke="#334155"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M58 84 Q72 88 86 84"
            fill="rgba(226, 232, 240, 0.55)"
            stroke="none"
          />
          <path
            d="M114 84 Q128 76 142 84"
            fill="none"
            stroke="#334155"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M114 84 Q128 88 142 84"
            fill="rgba(226, 232, 240, 0.55)"
            stroke="none"
          />
        </g>
      </g>

      <path
        d="M100 94 L118 104 L100 118 L82 104 Z"
        fill={`url(#${uid}-nose)`}
        stroke="#9a3412"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <ellipse cx="100" cy="112" rx="10" ry="3" fill="rgba(15, 23, 42, 0.08)" filter={`url(#${uid}-soft)`} />

      {isAsleep ? (
        <path
          d="M82 132 Q100 124 118 132"
          fill="none"
          stroke="#334155"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      ) : (
        <g>
          <path
            d="M76 126 Q100 144 124 126"
            fill="none"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="86" cy="129" r="2.2" fill="#1e293b" />
          <circle cx="100" cy="133" r="2.2" fill="#1e293b" />
          <circle cx="114" cy="129" r="2.2" fill="#1e293b" />
        </g>
      )}
    </svg>
  );
}
