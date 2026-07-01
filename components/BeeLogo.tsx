/**
 * Kumpas bee mark. A clean, high-contrast bee in the yellow/black palette,
 * designed to read well at small sizes (nav, header) and large (splash).
 * Uses currentColor-independent fills so it looks correct on any surface.
 */
export function BeeLogo({
  className = "",
  title = "Kumpas",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
    >
      {/* Wings */}
      <g className="bee-wing-left">
        <ellipse
          cx="24"
          cy="20"
          rx="10"
          ry="7"
          transform="rotate(-28 24 20)"
          fill="#ffffff"
          fillOpacity="0.85"
          stroke="#121212"
          strokeWidth="2"
        />
      </g>
      <g className="bee-wing-right">
        <ellipse
          cx="40"
          cy="20"
          rx="10"
          ry="7"
          transform="rotate(28 40 20)"
          fill="#ffffff"
          fillOpacity="0.85"
          stroke="#121212"
          strokeWidth="2"
        />
      </g>

      {/* Body */}
      <g stroke="#121212" strokeWidth="2.5">
        <ellipse cx="32" cy="38" rx="15" ry="18" fill="#f9c800" />
        {/* Stripes */}
        <path d="M20 30 H44" strokeLinecap="round" />
        <path d="M18 40 H46" strokeLinecap="round" />
        <path d="M21 50 H43" strokeLinecap="round" />
      </g>

      {/* Head */}
      <circle cx="32" cy="20" r="7" fill="#121212" />
      {/* Antennae */}
      <g stroke="#121212" strokeWidth="2" strokeLinecap="round">
        <path d="M29 15 Q26 9 28 6" />
        <path d="M35 15 Q38 9 36 6" />
      </g>
      <circle cx="28" cy="5.5" r="1.8" fill="#f9c800" stroke="#121212" strokeWidth="1.2" />
      <circle cx="36" cy="5.5" r="1.8" fill="#f9c800" stroke="#121212" strokeWidth="1.2" />
    </svg>
  );
}
