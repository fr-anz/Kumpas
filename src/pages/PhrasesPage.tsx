import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PHRASES } from '../data/phrases';
import { CATEGORIES, getCategoryMeta } from '../data/categories';
import { speak } from '../services/speechService';
import type { Category } from '../types/phrase';

export function PhrasesPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const activeCategory = (params.get('category') ?? 'all') as Category | 'all';

  const filtered = useMemo(() => {
    return PHRASES.filter(p => {
      const matchesCat = activeCategory === 'all' || p.category === activeCategory;
      const matchesQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.filipinoText.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [activeCategory, query]);

  function setCategory(cat: Category | 'all') {
    if (cat === 'all') params.delete('category');
    else params.set('category', cat);
    setParams(params, { replace: true });
  }

  return (
    <div className="animate-fade-in">

      {/* ── Search ─────────────────────────────────── */}
      <div className="relative mb-4">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="search"
          placeholder="Search phrases…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white border border-stone-100 text-sm font-medium placeholder-[#c4c4be] focus:outline-none focus:ring-2 focus:ring-[#0D3B36]/20"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        />
      </div>

      {/* ── Category tabs ───────────────────────────── */}
      <div className="-mx-5 sm:-mx-8 px-5 sm:px-8 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {/* All tab */}
          <button
            onClick={() => setCategory('all')}
            className={`tap-scale flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-[#0D3B36] text-white'
                : 'bg-white text-[#78716c] border border-stone-200'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`tap-scale flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat.id
                  ? 'text-white'
                  : 'bg-white text-[#78716c] border border-stone-200'
              }`}
              style={
                activeCategory === cat.id
                  ? { background: cat.color }
                  : {}
              }
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Phrase list ─────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-bold text-[#1c1917]">No phrases found</p>
          <p className="text-sm text-[#9ca3af] mt-1">Try a different search or category</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((phrase, i) => {
            const cat = getCategoryMeta(phrase.category);
            return (
              <li
                key={phrase.id}
                className="animate-slide-up"
                style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
              >
                <div
                  className="flex items-center gap-4 bg-white rounded-2xl border border-stone-100 overflow-hidden"
                  style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                >
                  {/* Category stripe */}
                  <div
                    className="w-1.5 self-stretch flex-shrink-0"
                    style={{ background: cat.color }}
                  />

                  {/* Text — tappable */}
                  <Link
                    to={`/communication/${phrase.id}`}
                    className="flex-1 py-4 pr-2 min-w-0"
                    aria-label={`Open communication card for: ${phrase.title}`}
                  >
                    <p className="font-black text-[#1c1917] text-[17px] leading-tight">
                      {phrase.filipinoText}
                    </p>
                    <p className="text-sm text-[#9ca3af] mt-1 leading-snug">
                      {phrase.text}
                    </p>
                    {phrase.priority === 'urgent' && (
                      <span
                        className="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ background: '#FEF2F2', color: '#DC2626' }}
                      >
                        Urgent
                      </span>
                    )}
                  </Link>

                  {/* Quick-speak button */}
                  <button
                    onClick={() => speak(phrase.text)}
                    aria-label={`Speak: ${phrase.text}`}
                    className="tap-scale flex-shrink-0 mr-4 w-10 h-10 rounded-xl flex items-center justify-center text-white transition-opacity hover:opacity-80"
                    style={{ background: cat.color }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    </svg>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="h-4" />
    </div>
  );
}
