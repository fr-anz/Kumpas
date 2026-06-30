import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPhraseById } from '../data/phrases';
import { getCategoryMeta } from '../data/categories';
import { speak, stopSpeaking, isSpeaking } from '../services/speechService';

export function CommunicationPage() {
  const { phraseId } = useParams<{ phraseId: string }>();
  const navigate = useNavigate();
  const phrase = phraseId ? getPhraseById(phraseId) : undefined;
  const [speaking, setSpeaking] = useState(false);

  // Poll speaking state
  useEffect(() => {
    const interval = setInterval(() => setSpeaking(isSpeaking()), 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  if (!phrase) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="text-5xl mb-4">😕</div>
        <p className="font-bold text-[#1c1917]">Phrase not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sm text-[#0D3B36] font-bold">
          ← Go back
        </button>
      </div>
    );
  }

  const cat = getCategoryMeta(phrase.category);

  function handleSpeak() {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      speak(phrase!.text);
      setSpeaking(true);
    }
  }

  function copyToClipboard() {
    navigator.clipboard?.writeText(phrase!.text).catch(() => {});
  }

  return (
    <div className="animate-scale-in flex flex-col min-h-[calc(100dvh-160px)]">

      {/* ── Back button ──────────────────────────────── */}
      <button
        onClick={() => navigate(-1)}
        className="tap-scale flex items-center gap-2 text-sm font-bold text-[#78716c] mb-6 -ml-1"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back
      </button>

      {/* ── Category badge ───────────────────────────── */}
      <div
        className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-xs font-bold mb-6"
        style={{ background: cat.bg, color: cat.color }}
      >
        <span>{cat.emoji}</span>
        {cat.label}
      </div>

      {/* ── Main card ────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-center rounded-3xl p-8 text-center"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f9f9f6 100%)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
          border: `3px solid ${cat.bg}`,
        }}
      >
        {/* Filipino — large, high visibility */}
        <p
          className="font-black text-[#1c1917] leading-tight mb-4"
          style={{ fontSize: 'clamp(1.6rem, 6vw, 2.4rem)' }}
        >
          {phrase.filipinoText}
        </p>

        {/* Divider */}
        <div className="w-12 h-0.5 rounded-full mb-4" style={{ background: cat.color, opacity: 0.3 }} />

        {/* English */}
        <p className="text-[#78716c] text-lg font-semibold leading-snug">
          {phrase.text}
        </p>
      </div>

      {/* ── Actions ──────────────────────────────────── */}
      <div className="mt-6 space-y-3">
        {/* Speak button */}
        <button
          onClick={handleSpeak}
          className="tap-scale w-full py-5 rounded-2xl font-black text-xl text-white flex items-center justify-center gap-3 transition-opacity"
          style={{
            background: speaking
              ? 'linear-gradient(135deg, #059669, #047857)'
              : `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)`,
          }}
          aria-label={speaking ? 'Stop speaking' : 'Speak phrase aloud'}
        >
          {speaking ? (
            <>
              <div className="speak-wave text-white">
                <span/><span/><span/><span/><span/>
              </div>
              Speaking…
            </>
          ) : (
            <>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              Speak Aloud
            </>
          )}
        </button>

        {/* Copy */}
        <button
          onClick={copyToClipboard}
          className="tap-scale w-full py-4 rounded-2xl font-bold text-[#78716c] bg-white border border-stone-200 flex items-center justify-center gap-2 text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copy to clipboard
        </button>
      </div>

    </div>
  );
}
