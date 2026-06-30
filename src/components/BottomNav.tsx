import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  {
    to: '/',
    label: 'Home',
    end: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    to: '/phrases',
    label: 'Library',
    end: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    to: '/camera',
    label: 'Camera',
    end: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 7l-7 5 7 5V7z"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
  },
  {
    to: '/emergency',
    label: 'Emergency',
    end: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-3xl"
    >
      {/* Frosted glass bar */}
      <div
        className="border-t border-black/[0.07] bg-white/95 backdrop-blur-xl px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2"
        style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.07)' }}
      >
        <ul className="grid grid-cols-4 gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            const isEmergency = item.to === '/emergency';

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    tap-scale flex flex-col items-center justify-center gap-1
                    min-h-[52px] rounded-2xl text-[10px] font-bold tracking-wide
                    transition-all duration-150
                    ${isActive && isEmergency ? 'bg-red-600 text-white' : ''}
                    ${isActive && !isEmergency ? 'bg-[#0D3B36] text-white' : ''}
                    ${!isActive && isEmergency ? 'text-red-500 hover:bg-red-50' : ''}
                    ${!isActive && !isEmergency ? 'text-[#78716c] hover:bg-stone-100' : ''}
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
