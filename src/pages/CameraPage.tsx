import { useRef, useState, useEffect, useCallback } from 'react';
import { speak, stopSpeaking, isSpeaking } from '../services/speechService';
import { mockPredict } from '../ml/mockPredictor';
import type { Prediction } from '../types/prediction';

type CameraState = 'idle' | 'active' | 'capturing' | 'processing' | 'result';

const CAPTURE_SECONDS = 4;

export function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camState, setCamState] = useState<CameraState>('idle');
  const [countdown, setCountdown] = useState(CAPTURE_SECONDS);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setSpeaking(isSpeaking()), 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => () => { stopCamera(); stopSpeaking(); }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCamState('active');
    } catch {
      console.warn('Camera access denied.');
      setCamState('idle');
    }
  }, []);

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamState('idle');
    setPrediction(null);
    setCountdown(CAPTURE_SECONDS);
  }

  async function captureSign() {
    if (camState !== 'active') return;
    setPrediction(null);
    setCamState('capturing');
    setCountdown(CAPTURE_SECONDS);

    // Countdown
    let remaining = CAPTURE_SECONDS;
    const countInterval = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) clearInterval(countInterval);
    }, 1000);

    // Run mock prediction (mirrors 4s capture + 1s processing in webcam_test.py)
    setCamState('processing');
    try {
      const result = await mockPredict(CAPTURE_SECONDS * 1000);
      setPrediction(result);
      setCamState('result');
    } catch {
      setCamState('active');
    }
  }

  function handleSpeak() {
    if (!prediction) return;
    if (speaking) { stopSpeaking(); setSpeaking(false); }
    else { speak(prediction.phrase); setSpeaking(true); }
  }

  const confidencePct = Math.round((prediction?.confidence ?? 0) * 100);

  return (
    <div className="animate-fade-in -mx-5 -mt-7 sm:-mx-8 flex flex-col" style={{ minHeight: 'calc(100dvh - 100px)' }}>

      {/* ── Camera viewport ─────────────────────────── */}
      <div className="relative flex-1 bg-[#0a0a0a] overflow-hidden" style={{ minHeight: 300 }}>

        {/* Video */}
        <video
          ref={videoRef}
          className="camera-mirror absolute inset-0 w-full h-full object-cover"
          autoPlay playsInline muted
        />

        {/* Idle state overlay */}
        {camState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </div>
            <p className="text-white/60 text-sm font-medium">Camera is off</p>
          </div>
        )}

        {/* Hand guide frame */}
        {(camState === 'active' || camState === 'capturing') && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-48 h-48 rounded-3xl"
              style={{ border: '2px solid rgba(74,222,128,0.6)', boxShadow: '0 0 0 1px rgba(74,222,128,0.2) inset' }}
            />
            {camState === 'active' && <div className="scan-line" />}
          </div>
        )}

        {/* Capture countdown */}
        {camState === 'capturing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-5xl font-black text-white"
              style={{ background: 'rgba(220,38,38,0.85)', backdropFilter: 'blur(4px)' }}
            >
              {countdown}
            </div>
            <p className="text-white font-bold mt-3 text-sm">Hold your sign steady</p>
          </div>
        )}

        {/* Processing */}
        {camState === 'processing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in bg-black/60">
            <div
              className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white"
              style={{ animation: 'spin 0.8s linear infinite' }}
            />
            <p className="text-white font-bold mt-4 text-sm">Analyzing 40 frames…</p>
          </div>
        )}

        {/* Status badge (active) */}
        {camState === 'active' && (
          <div className="absolute top-4 left-0 right-0 flex justify-center animate-slide-down">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur">
              <div className="w-2 h-2 rounded-full bg-red-500" style={{ animation: 'pulse 1.5s infinite' }} />
              <span className="text-white text-xs font-bold">CAMERA LIVE</span>
            </div>
          </div>
        )}

        {/* Warning badge */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
          <div className="px-3 py-1.5 rounded-full bg-amber-500/90 backdrop-blur">
            <span className="text-white text-[10px] font-bold uppercase tracking-wide">
              TEST MODE · 7 Signs · NO_SIGN class pending
            </span>
          </div>
        </div>
      </div>

      {/* ── Controls ─────────────────────────────────── */}
      <div
        className="px-5 sm:px-8 pt-5 pb-6 space-y-4"
        style={{ background: '#ffffff', boxShadow: '0 -8px 24px rgba(0,0,0,0.08)' }}
      >
        {/* Result card */}
        {camState === 'result' && prediction && (
          <div className="animate-slide-up rounded-2xl bg-[#f5f5ee] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#9ca3af]">Recognized</p>
                <p className="text-2xl font-black text-[#1c1917] mt-0.5">{prediction.label}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#9ca3af]">Confidence</p>
                <p className="text-2xl font-black text-[#0D3B36]">{confidencePct}%</p>
              </div>
            </div>

            {/* Confidence bar */}
            <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
              <div
                className="confidence-bar-fill h-full rounded-full"
                style={{
                  width: `${confidencePct}%`,
                  background: `linear-gradient(90deg, #0D3B36, ${confidencePct > 85 ? '#059669' : '#D97706'})`,
                }}
              />
            </div>

            <p className="text-[15px] font-bold text-[#1c1917]">→ "{prediction.phrase}"</p>

            {/* Speak result */}
            <button
              onClick={handleSpeak}
              className="tap-scale w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
              style={{ background: speaking ? '#059669' : '#0D3B36' }}
            >
              {speaking
                ? <><div className="speak-wave"><span/><span/><span/><span/><span/></div> Speaking…</>
                : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> Speak Phrase</>
              }
            </button>
          </div>
        )}

        {/* Camera controls */}
        <div className="flex gap-3">
          {camState === 'idle' ? (
            <button
              onClick={startCamera}
              className="tap-scale flex-1 py-4 rounded-2xl font-black text-white text-[17px]"
              style={{ background: 'linear-gradient(135deg, #0D3B36, #0d5a53)' }}
            >
              Start Camera
            </button>
          ) : (
            <>
              <button
                onClick={stopCamera}
                className="tap-scale py-4 px-5 rounded-2xl font-bold text-[#78716c] bg-stone-100 text-sm"
              >
                Stop
              </button>
              <button
                onClick={captureSign}
                disabled={camState === 'capturing' || camState === 'processing'}
                className="tap-scale flex-1 py-4 rounded-2xl font-black text-white text-[17px] disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
              >
                {camState === 'capturing' ? `Capturing… ${countdown}s`
                  : camState === 'processing' ? 'Analyzing…'
                  : '👐 Capture Sign'}
              </button>
            </>
          )}
        </div>

        <p className="text-center text-[11px] text-[#9ca3af] font-medium">
          Trained signs: YES · NO · DEAF · THANK YOU · SLOW · DON'T UNDERSTAND · MARRIAGE LICENSE
        </p>
      </div>

      {/* Spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
