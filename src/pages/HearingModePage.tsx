import { useState } from 'react';
import { Link } from 'react-router-dom';
import { simplifyText, suggestedPhraseIds } from '../services/simplifierService';
import { speak } from '../services/speechService';
import { getPhraseById } from '../data/phrases';

export function HearingModePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [suggestionIds, setSuggestionIds] = useState<string[]>([]);

  function handleSimplify() {
    if (!input.trim()) return;
    setResult(simplifyText(input));
    setSuggestionIds(suggestedPhraseIds(input));
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#1c1917]">Hearing Person Mode</h1>
        <p className="text-sm text-[#9ca3af] mt-1 leading-relaxed">
          Type your message and Kumpas will simplify it into plain, clear language.
        </p>
      </div>

      {/* ── Input ────────────────────────────────────── */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-[#9ca3af] mb-2">
          Type your message
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. Your document is still being processed by our records department…"
          rows={5}
          className="w-full px-4 py-3.5 rounded-2xl bg-white border border-stone-200 text-[15px] font-medium placeholder-[#c4c4be] resize-none focus:outline-none focus:ring-2 focus:ring-[#0D3B36]/20"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        />
      </div>

      <button
        onClick={handleSimplify}
        disabled={!input.trim()}
        className="tap-scale w-full py-4 rounded-2xl font-black text-white text-[17px] disabled:opacity-40"
        style={{ background: 'linear-gradient(135deg, #0D3B36, #0d5a53)' }}
      >
        Simplify Message
      </button>

      {/* ── Result ───────────────────────────────────── */}
      {result && (
        <div className="animate-slide-up space-y-3">
          <div
            className="rounded-2xl p-5 border-l-4 bg-white"
            style={{ borderColor: '#059669', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#059669] mb-2">
              Simplified
            </p>
            <p className="text-xl font-black text-[#1c1917] leading-snug">{result}</p>
          </div>

          <button
            onClick={() => speak(result)}
            className="tap-scale w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
            Speak Simplified Message
          </button>

          {/* Suggested phrases */}
          {suggestionIds.length > 0 && (
            <div className="animate-fade-in">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#9ca3af] mb-2">
                Suggested phrases
              </p>
              <div className="space-y-2">
                {suggestionIds.map(id => {
                  const phrase = getPhraseById(id);
                  if (!phrase) return null;
                  return (
                    <Link
                      key={id}
                      to={`/communication/${id}`}
                      className="tap-scale flex items-center gap-3 p-4 bg-white rounded-2xl border border-stone-100"
                      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                    >
                      <span className="text-xl">💬</span>
                      <div>
                        <p className="font-black text-[#1c1917] text-[15px]">{phrase.filipinoText}</p>
                        <p className="text-sm text-[#9ca3af]">{phrase.text}</p>
                      </div>
                      <svg className="ml-auto text-[#d1d5db]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
