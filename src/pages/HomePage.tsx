import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';

export function HomePage() {
  return (
    <div className="animate-fade-in space-y-5">

      {/* ── Hero banner ─────────────────────────────── */}
      <div
        className="-mx-5 -mt-7 px-5 pt-8 pb-10 sm:-mx-8 sm:px-8 animate-slide-down"
        style={{ background: 'linear-gradient(150deg, #0a2e2c 0%, #0d4a45 60%, #145950 100%)' }}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 mb-2">
          Filipino Sign Language Communicator
        </p>
        <h1 className="text-[2rem] font-black text-white leading-[1.1] tracking-tight max-w-xs">
          Essential communication,{' '}
          <span style={{ color: '#6ee7b7' }}>within reach.</span>
        </h1>
        <p className="mt-3 text-sm text-white/50 leading-relaxed max-w-[260px]">
          Tap any phrase to display large text and speak it aloud. No internet needed.
        </p>
      </div>

      {/* ── Emergency CTA ───────────────────────────── */}
      <Link
        to="/emergency"
        className="tap-scale emergency-pulse flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-black text-xl text-white"
        style={{ background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
        Emergency Card
      </Link>

      {/* ── Category grid ───────────────────────────── */}
      <section>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9ca3af] mb-3">
          Browse Phrases
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/phrases?category=${cat.id}`}
              className="card-hover tap-scale flex flex-col gap-3 p-5 rounded-2xl bg-white border border-stone-100"
              style={{
                animationDelay: `${i * 50}ms`,
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: cat.bg }}
              >
                {cat.emoji}
              </div>
              <span className="font-black text-[#1c1917] text-[15px]">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Hearing Person Mode ──────────────────────── */}
      <Link
        to="/hearing"
        className="card-hover tap-scale flex items-center gap-4 p-5 rounded-2xl bg-white border border-stone-100"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: '#f0fdfa' }}>
          👂
        </div>
        <div className="min-w-0">
          <div className="font-black text-[#1c1917] text-[15px]">Hearing Person Mode</div>
          <div className="text-sm text-[#9ca3af] mt-0.5">Simplify and speak any message</div>
        </div>
        <svg className="ml-auto text-[#d1d5db] flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </Link>

    </div>
  );
}
