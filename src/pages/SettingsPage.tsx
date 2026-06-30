import { useState } from 'react';
import { getProfile, saveProfile, clearAllData } from '../services/storageService';
import { speak } from '../services/speechService';
import type { UserProfile } from '../types/userProfile';

const EMPTY: UserProfile = {
  name: '', emergencyContactName: '', emergencyContactNumber: '',
  medicalNote: '', addressNote: '',
};

export function SettingsPage() {
  const saved = getProfile();
  const [profile, setProfile] = useState<UserProfile>(saved ?? EMPTY);
  const [saved_, setSaved_] = useState(false);
  const [cleared, setCleared] = useState(false);

  function handleSave() {
    saveProfile(profile);
    setSaved_(true);
    setTimeout(() => setSaved_(false), 2000);
  }

  function handleClear() {
    if (!confirm('Clear all local data? This cannot be undone.')) return;
    clearAllData();
    setProfile(EMPTY);
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  }

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-black text-[#1c1917]">Settings</h1>

      {/* ── Emergency Profile ───────────────────────── */}
      <Section title="Emergency Profile" emoji="🚨">
        <div className="space-y-3">
          {[
            { key: 'name', label: 'Your name', placeholder: 'Full name' },
            { key: 'emergencyContactName', label: 'Emergency contact name', placeholder: 'Contact name' },
            { key: 'emergencyContactNumber', label: 'Emergency contact number', placeholder: '+63 9XX XXX XXXX' },
            { key: 'medicalNote', label: 'Medical note', placeholder: 'e.g. Diabetic' },
            { key: 'addressNote', label: 'Address / barangay', placeholder: 'e.g. Brgy. San Isidro, QC' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#9ca3af] mb-1">
                {f.label}
              </label>
              <input
                type="text"
                value={profile[f.key as keyof UserProfile]}
                onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-4 py-3 rounded-xl bg-[#f5f5ee] border border-stone-200 text-sm font-medium placeholder-[#c4c4be] focus:outline-none focus:ring-2 focus:ring-[#0D3B36]/20"
              />
            </div>
          ))}
          <button
            onClick={handleSave}
            className="tap-scale w-full py-3.5 rounded-xl font-black text-white text-sm"
            style={{ background: saved_ ? '#059669' : '#0D3B36' }}
          >
            {saved_ ? '✓ Saved!' : 'Save Profile'}
          </button>
        </div>
      </Section>

      {/* ── Speech Test ──────────────────────────────── */}
      <Section title="Speech" emoji="🔊">
        <button
          onClick={() => speak('Kumpas is working. I am Deaf. Please help me.')}
          className="tap-scale w-full py-3.5 rounded-xl font-bold text-[#0D3B36] bg-[#e8f5f3] text-sm"
        >
          Test Text-to-Speech
        </button>
      </Section>

      {/* ── Data ─────────────────────────────────────── */}
      <Section title="Data & Privacy" emoji="🔒">
        <p className="text-sm text-[#9ca3af] mb-3 leading-relaxed">
          All data is stored locally on this device. Nothing is sent to any server.
        </p>
        <button
          onClick={handleClear}
          className="tap-scale w-full py-3.5 rounded-xl font-bold text-red-600 bg-red-50 text-sm border border-red-100"
        >
          {cleared ? '✓ Data cleared' : 'Clear All Local Data'}
        </button>
      </Section>

      {/* ── About ────────────────────────────────────── */}
      <Section title="About Kumpas" emoji="ℹ️">
        <div className="space-y-2 text-sm text-[#9ca3af]">
          <p><span className="font-bold text-[#1c1917]">Kumpas</span> is an offline-first Filipino Sign Language communication assistant.</p>
          <p>Designed for Deaf Filipinos in public-service and emergency situations.</p>
          <div className="pt-2 border-t border-stone-100 space-y-1">
            <p className="font-bold text-[#1c1917]">Model: baseline-v3</p>
            <p>7 classes · Conv1D temporal classifier · 66,790 params</p>
            <p className="text-amber-600 font-medium">⚠ Model is provisional — NO_SIGN class pending</p>
          </div>
          <p className="pt-1 font-bold text-[#1c1917]">Version 0.1.0 · Hackathon build</p>
        </div>
      </Section>

    </div>
  );
}

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white border border-stone-100 overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-stone-100">
        <span className="text-xl">{emoji}</span>
        <h2 className="font-black text-[#1c1917] text-[15px]">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
