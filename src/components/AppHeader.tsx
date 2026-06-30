import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function AppHeader() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-5 py-3 sm:px-8"
      style={{
        background: '#0D3B36',
        boxShadow: '0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <Link to="/" className="flex items-center gap-2.5" aria-label="Kumpas home">
        {/* Logo mark */}
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-white font-black text-sm">
          K
        </div>
        <span className="text-white font-black text-xl tracking-tight">Kumpas</span>
      </Link>

      {/* Status + settings */}
      <div className="flex items-center gap-3">
        {/* Online/Offline pill */}
        <div className="flex items-center gap-1.5">
          <div
            className={`h-2 w-2 rounded-full ${online ? 'bg-emerald-400' : 'bg-amber-400'}`}
            style={online ? {} : { animation: 'pulse 1.5s ease-in-out infinite' }}
          />
          <span className="text-[11px] font-semibold text-white/60 hidden sm:block">
            {online ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Settings link */}
        <Link
          to="/settings"
          aria-label="Settings"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </Link>
      </div>
    </header>
  );
}
