"use client";

import { useEffect, useState } from "react";
import { loadProfile, saveProfile } from "@/services/storageService";
import { EmergencyProfileCard } from "@/components/EmergencyProfileCard";
import { SpeakButton } from "@/components/SpeakButton";
import type { UserProfile } from "@/types/userProfile";
import { useLanguage } from "@/i18n/LanguageProvider";

const EMPTY_PROFILE: UserProfile = {
  name: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  medicalNote: "",
  addressNote: "",
};

export default function EmergencyPage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(EMPTY_PROFILE);
  const [loaded, setLoaded] = useState(false);

  const emergencyMessage = t("emergency.message");

  useEffect(() => {
    const saved = loadProfile();
    setProfile(saved);
    setDraft(saved ?? EMPTY_PROFILE);
    setEditing(!saved);
    setLoaded(true);
  }, []);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    saveProfile(draft);
    setProfile(draft);
    setEditing(false);
  };

  if (!loaded) {
    return <p className="text-text-muted">{t("common.loading")}</p>;
  }

  return (
    <div className="flex flex-col gap-6 page-enter">
      <h1 className="text-3xl font-black tracking-tight">
        {t("emergency.title")}
      </h1>

      {/* Always-available emergency speech, even before a profile exists. */}
      <div className="rounded-card border-2 border-danger bg-surface p-5 shadow-[var(--shadow)]">
        <p className="text-lg font-bold">{emergencyMessage}</p>
        <SpeakButton
          text={emergencyMessage}
          label={t("emergency.speakMessage")}
          className="mt-4 w-full"
        />
      </div>

      {profile && !editing ? (
        <>
          <EmergencyProfileCard profile={profile} />

          {/* Share emergency card */}
          <button
            type="button"
            onClick={async () => {
              const shareText = [
                "I AM DEAF / BINGI AKO",
                profile.name ? `Name: ${profile.name}` : "",
                profile.emergencyContactName || profile.emergencyContactNumber
                  ? `Contact: ${profile.emergencyContactName} ${profile.emergencyContactNumber}`.trim()
                  : "",
                profile.medicalNote ? `Medical: ${profile.medicalNote}` : "",
                profile.addressNote ? `Address: ${profile.addressNote}` : "",
              ]
                .filter(Boolean)
                .join("\n");

              if (navigator.share) {
                try {
                  await navigator.share({ text: shareText });
                } catch {
                  // cancelled — ignore
                }
              } else {
                await navigator.clipboard?.writeText(shareText).catch(() => {});
              }
            }}
            className="flex min-h-12 items-center justify-center gap-2 rounded-button border-2 border-bee-black bg-surface px-6 text-base font-bold transition-colors hover:bg-surface-alt"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share emergency card
          </button>

          <button
            type="button"
            onClick={() => {
              setDraft(profile);
              setEditing(true);
            }}
            className="flex min-h-12 items-center justify-center rounded-button border-2 border-bee-black bg-surface px-6 text-lg font-bold transition-colors hover:bg-surface-alt"
          >
            {t("emergency.editProfile")}
          </button>
        </>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <h2 className="text-xl font-extrabold">
            {profile ? t("emergency.editTitle") : t("emergency.setupTitle")}
          </h2>
          <Field
            label={t("emergency.name")}
            value={draft.name}
            onChange={(value) => setDraft({ ...draft, name: value })}
          />
          <Field
            label={t("emergency.contactName")}
            value={draft.emergencyContactName}
            onChange={(value) =>
              setDraft({ ...draft, emergencyContactName: value })
            }
          />
          <Field
            label={t("emergency.contactNumber")}
            type="tel"
            value={draft.emergencyContactNumber}
            onChange={(value) =>
              setDraft({ ...draft, emergencyContactNumber: value })
            }
          />
          <Field
            label={t("emergency.medicalNote")}
            value={draft.medicalNote}
            onChange={(value) => setDraft({ ...draft, medicalNote: value })}
          />
          <Field
            label={t("emergency.addressNote")}
            value={draft.addressNote}
            onChange={(value) => setDraft({ ...draft, addressNote: value })}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex min-h-12 flex-1 items-center justify-center rounded-button bg-bee-yellow px-6 text-lg font-black text-bee-black transition-colors hover:bg-bee-yellow-bright"
            >
              {t("emergency.saveProfile")}
            </button>
            {profile && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex min-h-12 items-center justify-center rounded-button border-2 border-bee-black bg-surface px-6 text-lg font-bold"
              >
                {t("common.cancel")}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );

}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-bold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 rounded-button border border-border bg-surface px-4 text-lg shadow-[var(--shadow)]"
      />
    </label>
  );
}
