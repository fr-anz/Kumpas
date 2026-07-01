/** Philippines flag — inline SVG so it works fully offline. */
export function PhFlag({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={className}
      role="img"
      aria-label="Philippines"
    >
      {/* Blue top, red bottom */}
      <rect width="30" height="10" fill="#0038a8" />
      <rect y="10" width="30" height="10" fill="#ce1126" />
      {/* White triangle at hoist */}
      <path d="M0 0 L13 10 L0 20 Z" fill="#fff" />
      {/* Sun */}
      <circle cx="4.2" cy="10" r="2.2" fill="#fcd116" />
      {/* Three stars (corners) */}
      <circle cx="1.6" cy="2.2" r="0.8" fill="#fcd116" />
      <circle cx="1.6" cy="17.8" r="0.8" fill="#fcd116" />
      <circle cx="9.5" cy="10" r="0.8" fill="#fcd116" />
    </svg>
  );
}
