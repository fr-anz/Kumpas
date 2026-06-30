"use client";

import type { UserProfile } from "@/types/userProfile";
import { useLanguage } from "@/i18n/LanguageProvider";

/** High-contrast card showing the user's saved emergency details. */
export function EmergencyProfileCard({ profile }: { profile: UserProfile }) {
  const { t } = useLanguage();
  return (
    <div className="overflow-hidden rounded-card border border-border shadow-[var(--shadow)]">
      <div className="bg-bee-yellow px-5 py-6">
        <p className="text-3xl font-black text-bee-black">
          {t("emergency.iAmDeaf")}
        </p>
      </div>
      <dl className="divide-y divide-border bg-surface">
        <Row label={t("emergency.name")} value={profile.name} />
        <Row
          label={t("emergency.contact")}
          value={
            profile.emergencyContactName || profile.emergencyContactNumber
              ? `${profile.emergencyContactName} · ${profile.emergencyContactNumber}`
              : ""
          }
        />
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
      <dd className="mt-1 text-lg font-semibold">{value}</dd>
    </div>
  );
}
