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
    <div className="overflow-hidden rounded-card shadow-[0_8px_32px_rgba(215,38,61,0.20)]">

      {/* Red header — "I AM DEAF" in both languages */}
      <div
        className="flex flex-col items-center justify-center gap-1 px-6 py-8"
        style={{ background: "var(--danger)" }}
      >
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
      <dl className="divide-y divide-border bg-surface">
        <Row label={t("emergency.name")} value={profile.name} />
        {(profile.emergencyContactName || profile.emergencyContactNumber) && (
          <div className="px-5 py-4">
            <dt className="text-xs font-bold uppercase tracking-wider text-text-muted">
              {t("emergency.contact")}
            </dt>
            <dd className="mt-1 flex items-center gap-3">
              <Phone className="h-5 w-5 flex-shrink-0 text-danger" aria-hidden="true" />
              <span className="text-lg font-bold">
                {profile.emergencyContactName}
                {profile.emergencyContactNumber && (
                  <span className="ml-2 text-text-muted font-semibold">
                    {profile.emergencyContactNumber}
                  </span>
                )}
              </span>
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
