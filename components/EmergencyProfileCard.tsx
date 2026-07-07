"use client";

import { Phone } from "lucide-react";
import type { UserProfile } from "@/types/userProfile";
import { useLanguage } from "@/i18n/LanguageProvider";

/**
 * High-impact emergency card — designed to be readable from a metre away and
 * immediately understood by any first responder.
 *
 * Layout:
 *  ┌──────────────────────────────────────────┐
 *  │  (danger-red band)  I AM DEAF / BINGI AKO│
 *  ├──────────────────────────────────────────┤
 *  │  Name · Contact · Medical · Address rows  │
 *  └──────────────────────────────────────────┘
 */
export function EmergencyProfileCard({ profile }: { profile: UserProfile }) {
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden rounded-[2rem] border-2 border-bee-black bg-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">

      {/* Red header — "I AM DEAF" in both languages */}
      <div
        className="flex flex-col items-center justify-center gap-1 px-6 py-8 border-b-2 border-bee-black"
        style={{ background: "var(--danger)" }}
      >
        {profile.photoBase64 && (
          <img 
            src={profile.photoBase64} 
            alt={profile.name} 
            className="mb-3 h-24 w-24 rounded-full border-2 border-white object-cover shadow-lg"
          />
        )}
        <p className="text-center text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl">
          I AM DEAF
        </p>
        <p className="text-center text-2xl font-black text-white/75">
          BINGI AKO
        </p>
        <p className="mt-3 text-center text-sm font-semibold text-white/60 leading-snug max-w-xs">
          Please communicate via text, writing, or slow clear speech.
        </p>
      </div>

      {/* Profile details */}
      <dl className="divide-y-2 divide-bee-black bg-surface">
        <Row label={t("emergency.name")} value={profile.name} />
        {(profile.emergencyContactName || profile.emergencyContactNumber) && (
          <div className="px-5 py-4">
            <dt className="text-xs font-bold uppercase tracking-wider text-text-muted">
              {t("emergency.contact")}
            </dt>
            <dd className="mt-1 flex items-center gap-3">
              <Phone className="h-5 w-5 flex-shrink-0 text-danger" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="text-lg font-bold">
                  {profile.emergencyContactName}
                </span>
                {profile.emergencyContactNumber && (
                  <span className="text-base text-text-muted font-semibold">
                    {profile.emergencyContactNumber}
                  </span>
                )}
              </div>
            </dd>
          </div>
        )}
        <Row label={t("emergency.medicalNote")} value={profile.medicalNote} />
        <Row label={t("emergency.address")} value={profile.addressNote} />
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="px-5 py-4">
      <dt className="text-xs font-bold uppercase tracking-wider text-text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-lg font-bold">{value}</dd>
    </div>
  );
}
