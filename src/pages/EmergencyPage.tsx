import { useState, useEffect } from 'react';
import { getProfile, saveProfile } from '../services/storageService';
import { speak, isSpeaking, stopSpeaking } from '../services/speechService';
import type { UserProfile } from '../types/userProfile';

const EMPTY: UserProfile = {
  name: '',
  emergencyContactName: '',
  emergencyContactNumber: '',
  medicalNote: '',
  addressNote: '',
};

export function EmergencyPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(EMPTY);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const saved = getProfile();
    setProfile(saved);
    if (!saved) setEditing(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setSpeaking(isSpeaking()), 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => () => stopSpeaking(), []);

  function handleSave() {
    saveProfile(draft);
    setProfile(draft);
    setEditing(false);
  }

  function handleEdit() {
    setDraft(profile ?? EMPTY);
    setEditing(true);
  }

  function buildEmergencyMessage(p: UserProfile): string {
    let msg = 'I am Deaf. I need help.';
    if (p.name) msg += ` My name is ${p.name}.`;
    if (p.emergencyContactName && p.emergencyContactNumber)
      msg += ` Please contact ${p.emergencyContactName} at ${p.emergencyContactNumber}.`;
    if (p.medicalNote) msg += ` Medical note: ${p.medicalNote}.`;
    return msg;
  }

  function handleSpeak() {
    if (!profile) return;
    if (speaking) { stopSpeaking(); setSpeaking(false); }
    else { speak(buildEmergencyMessage(profile)); setSpeaking(true); }
  }

  /* ── EDIT FORM ──────────────────────────────────────── */
  if (editing) {
    return (
      <div className="animate-slide-up">
        <h1 className="text-2xl font-black text-[#1c1917] mb-1">Emergency Profile</h1>
        <p className="text-sm text-[#9ca3af] mb-6">
          This info appears on your emergency card and is stored only on this device.
        </p>

        <div className="space-y-4">
          {[
            { key: 'name', label: 'Your name', placeholder: 'Full name' },
            { key: 'emergencyContactName', label: 'Emergency contact name', placeholder: 'Contact name' },
            { key: 'emergencyContactNumber', label: 'Emergency contact number', placeholder: '+63 9XX XXX XXXX' },
            { key: 'medicalNote', label: 'Medical note (optional)', placeholder: 'e.g. Diabetic, allergic to penicillin' },
            { key: 'addressNote', label: 'Address / barangay (optional)', placeholder: 'e.g. Brgy. San Isidro, Quezon City' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#9ca3af] mb-1.5">
                {field.label}
              </label>
              <input
                type="text"
                value={draft[field.key as keyof UserProfile]}
                onChange={e => setDraft(d => ({ ...d, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full px-4 py-3.5 rounded-2xl bg-white border border-stone-200 text-[15px] font-medium placeholder-[#c4c4be] focus:outline-none focus:ring-2 focus:ring-[#0D3B36]/20"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={!draft.name}
          className="tap-scale mt-6 w-full py-4 rounded-2xl font-black text-white text-lg disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #0D3B36, #0d5a53)' }}
        >
          Save Emergency Profile
        </button>
        {profile && (
          <button
            onClick={() => setEditing(false)}
            className="mt-3 w-full py-3 rounded-2xl font-bold text-[#78716c] text-sm bg-white border border-stone-200"
          >
            Cancel
          </button>
        )}
      </div>
    );
  }

  /* ── EMERGENCY CARD ─────────────────────────────────── */
  return (
    <div className="animate-scale-in flex flex-col gap-5">

      {/* Card */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{ boxShadow: '0 8px 32px rgba(220,38,38,0.18)' }}
      >
        {/* Red header strip */}
        <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}>
          <p className="text-red-200 text-xs font-bold uppercase tracking-widest mb-1">Emergency Card</p>
          <p
            className="text-white font-black leading-tight"
            style={{ fontSize: 'clamp(2rem, 8vw, 2.8rem)' }}
          >
            I AM DEAF
          </p>
          <p className="text-red-200 text-sm mt-1 leading-snug">
            Please communicate with me via text, writing, or by speaking clearly and slowly.
          </p>
        </div>

        {/* Profile info */}
        <div className="bg-white px-6 py-5 space-y-4">
          {profile?.name && (
            <InfoRow icon="👤" label="Name" value={profile.name} />
          )}
          {profile?.emergencyContactName && (
            <InfoRow
              icon="📞"
              label="Emergency Contact"
              value={`${profile.emergencyContactName}${profile.emergencyContactNumber ? ` · ${profile.emergencyContactNumber}` : ''}`}
            />
          )}
          {profile?.medicalNote && (
            <InfoRow icon="💊" label="Medical Note" value={profile.medicalNote} />
          )}
          {profile?.addressNote && (
            <InfoRow icon="📍" label="Address" value={profile.addressNote} />
          )}
        </div>
      </div>

      {/* Speak */}
      <button
        onClick={handleSpeak}
        className="tap-scale emergency-pulse w-full py-5 rounded-2xl font-black text-xl text-white flex items-center justify-center gap-3"
        style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
      >
        {speaking ? (
          <>
            <div className="speak-wave"><span/><span/><span/><span/><span/></div>
            Speaking…
          </>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
            Speak Emergency Message
          </>
        )}
      </button>

      {/* Edit */}
      <button
        onClick={handleEdit}
        className="tap-scale w-full py-4 rounded-2xl font-bold text-sm text-[#78716c] bg-white border border-stone-200"
      >
        ✏️ Edit Profile
      </button>

    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">{label}</p>
        <p className="text-[15px] font-bold text-[#1c1917] mt-0.5">{value}</p>
      </div>
    </div>
  );
}
