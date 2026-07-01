"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useFontSize } from "@/components/FontSizeProvider";
import { BeeLogo } from "@/components/BeeLogo";
import { loadProfile, saveProfile } from "@/services/storageService";
import {
  validatePhilippineMobile,
  formatPhilippineMobile,
} from "@/utils/phone";
import type { Language } from "@/i18n/translations";
import type { FontSizePreference } from "@/services/storageService";

/**
 * First-launch onboarding: welcome → preferences (language + text size) →
 * optional emergency ID. On finish it persists everything and calls onDone,
 * which flips the onboarded flag so the main app renders.
 */
export function Onboarding({ onDone }: { onDone: () => void }) {
  const { language, setLanguage, t } = useLanguage();
  const { fontSize, setFontSize } = useFontSize();
  const [step, setStep] = useState(0);
  // Direction drives the slide animation: forward slides in from the right,
  // back slides in from the left.
  const [dir, setDir] = useState<"fwd" | "back">("fwd");

  const goTo = (next: number) => {
    setDir(next > step ? "fwd" : "back");
    setStep(next);
  };

  const existing = loadProfile();
  const [name, setName] = useState(existing?.name ?? "");
  const [contact, setContact] = useState(
    existing?.emergencyContactNumber ?? "",
  );

  const finish = (withProfile: boolean) => {
    if (withProfile && (name.trim() || contact.trim())) {
      // Store the normalized E.164 number when valid, else the raw entry.
      const check = validatePhilippineMobile(contact.trim());
      const number = check.valid ? check.normalized : contact.trim();
      saveProfile({
        name: name.trim(),
        emergencyContactName: existing?.emergencyContactName ?? "",
        emergencyContactNumber: number,
        medicalNote: existing?.medicalNote ?? "",
        addressNote: existing?.addressNote ?? "",
      });
    }
    onDone();
  };

  const anim = dir === "fwd" ? "step-in-right" : "step-in-left";

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-5 py-8 sm:px-8">
      {/* Progress dots */}
      <div
        className="mb-8 flex items-center justify-center gap-2"
        aria-label={`${t("onb.step")} ${step + 1} ${t("onb.of")} 3`}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === step ? "w-8 bg-bee-yellow" : "w-2 bg-border"
            }`}
          />
        ))}
      </div>

      {/* key on step re-triggers the slide animation each transition */}
      <div key={step} className={`flex flex-1 flex-col ${anim}`}>
        {step === 0 && <Welcome t={t} onNext={() => goTo(1)} />}
        {step === 1 && (
          <Preferences
            t={t}
            language={language}
            setLanguage={setLanguage}
            fontSize={fontSize}
            setFontSize={setFontSize}
            onBack={() => goTo(0)}
            onNext={() => goTo(2)}
          />
        )}
        {step === 2 && (
          <ProfileStep
            t={t}
            name={name}
            setName={setName}
            contact={contact}
            setContact={setContact}
            onBack={() => goTo(1)}
            onFinish={finish}
          />
        )}
      </div>
    </div>
  );
}

type T = (key: string) => string;

function PrimaryButton({
  children,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="flex min-h-14 w-full items-center justify-center gap-2 rounded-button bg-bee-yellow px-6 text-lg font-black text-bee-black transition-colors hover:bg-bee-yellow-bright active:bg-bee-amber"
    >
      {children}
    </button>
  );
}

function Welcome({ t, onNext }: { t: T; onNext: () => void }) {
  return (
    <section className="flex flex-1 flex-col">
      {/* Logo + welcome title, vertically and horizontally centered. */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <BeeLogo
          src="/kumpas_onboarding.svg"
          className="h-36 w-36 drop-shadow-md sm:h-44 sm:w-44"
        />
        <h1 className="text-center text-4xl font-black leading-tight tracking-tight sm:text-5xl">
          {t("onb.welcomeTitle")}
        </h1>
      </div>
      <div className="mt-8">
        <PrimaryButton onClick={onNext}>
          {t("onb.getStarted")}
          <ArrowRight aria-hidden="true" className="h-5 w-5" />
        </PrimaryButton>
      </div>
    </section>
  );
}

function Preferences({
  t,
  language,
  setLanguage,
  fontSize,
  setFontSize,
  onBack,
  onNext,
}: {
  t: T;
  language: Language;
  setLanguage: (l: Language) => void;
  fontSize: FontSizePreference;
  setFontSize: (s: FontSizePreference) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const sizes: Array<{ value: FontSizePreference; key: string }> = [
    { value: "normal", key: "onb.sizeNormal" },
    { value: "large", key: "onb.sizeLarge" },
    { value: "xlarge", key: "onb.sizeXlarge" },
  ];

  return (
    <section className="flex flex-1 flex-col gap-8">
      <BackHeader t={t} onBack={onBack} title={t("onb.prefsTitle")} />

      {/* Language segmented toggle */}
      <div className="flex flex-col gap-3">
        <span className="font-bold">{t("onb.language")}</span>
        <div
          className="grid grid-cols-2 gap-1 rounded-pill border border-border bg-surface p-1"
          role="group"
          aria-label={t("onb.language")}
        >
          {(["en", "fil"] as Language[]).map((lng) => (
            <button
              key={lng}
              type="button"
              onClick={() => setLanguage(lng)}
              aria-pressed={language === lng}
              className={`min-h-12 rounded-pill px-4 text-base font-bold transition-colors ${
                language === lng
                  ? "bg-bee-yellow text-bee-black"
                  : "text-text hover:bg-surface-alt"
              }`}
            >
              {lng === "en" ? "English" : "Filipino"}
            </button>
          ))}
        </div>
      </div>

      {/* Text size — 3 large tap targets */}
      <div className="flex flex-col gap-3">
        <span className="font-bold">{t("onb.textSize")}</span>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setFontSize(s.value)}
              aria-pressed={fontSize === s.value}
              className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-card border-2 p-2 transition-colors ${
                fontSize === s.value
                  ? "border-bee-yellow bg-bee-yellow/10"
                  : "border-border bg-surface hover:bg-surface-alt"
              }`}
            >
              <span
                aria-hidden="true"
                className={
                  s.value === "normal"
                    ? "text-lg font-black"
                    : s.value === "large"
                      ? "text-2xl font-black"
                      : "text-3xl font-black"
                }
              >
                A
              </span>
              <span className="text-xs font-bold">{t(s.key)}</span>
            </button>
          ))}
        </div>
        {/* Live preview — scales with the root font-size change. */}
        <p className="rounded-card border border-border bg-surface p-4 text-center font-semibold">
          {t("onb.sizePreview")}
        </p>
      </div>

      <div className="mt-auto">
        <PrimaryButton onClick={onNext}>
          {t("onb.next")}
          <ArrowRight aria-hidden="true" className="h-5 w-5" />
        </PrimaryButton>
      </div>
    </section>
  );
}

function ProfileStep({
  t,
  name,
  setName,
  contact,
  setContact,
  onBack,
  onFinish,
}: {
  t: T;
  name: string;
  setName: (v: string) => void;
  contact: string;
  setContact: (v: string) => void;
  onBack: () => void;
  onFinish: (withProfile: boolean) => void;
}) {
  const trimmed = contact.trim();
  const check = trimmed ? validatePhilippineMobile(trimmed) : null;
  const showError = trimmed.length > 0 && check !== null && !check.valid;
  const showValid = check !== null && check.valid;
  // Block finishing only when a number was entered but is invalid.
  const canFinish = !trimmed || (check?.valid ?? false);

  return (
    <section className="flex flex-1 flex-col gap-6">
      <BackHeader t={t} onBack={onBack} title={t("onb.profileTitle")} />

      <p className="text-lg leading-relaxed text-text-muted">
        {t("onb.profileContext")}
      </p>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (canFinish) onFinish(true);
        }}
      >
        <label className="flex flex-col gap-1.5">
          <span className="font-bold">{t("onb.name")}</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="min-h-12 rounded-button border border-border bg-surface px-4 text-lg shadow-[var(--shadow)]"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-bold">{t("onb.contactNumber")}</span>
          <input
            type="tel"
            inputMode="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            autoComplete="tel"
            aria-invalid={showError}
            aria-describedby="contact-feedback"
            className={`min-h-12 rounded-button border bg-surface px-4 text-lg shadow-[var(--shadow)] ${
              showError
                ? "border-danger"
                : showValid
                  ? "border-success"
                  : "border-border"
            }`}
          />
          <span id="contact-feedback" className="min-h-5 text-sm font-semibold">
            {showValid && check ? (
              <span className="flex items-center gap-1.5 text-success">
                <Check aria-hidden="true" className="h-4 w-4" />
                {t("onb.contactValid")} · {formatPhilippineMobile(check.normalized)}
              </span>
            ) : showError ? (
              <span className="text-danger">{t("onb.contactInvalid")}</span>
            ) : (
              <span className="text-text-muted">{t("onb.contactHint")}</span>
            )}
          </span>
        </label>

        <div className="mt-2 flex flex-col gap-3">
          <button
            type="submit"
            disabled={!canFinish}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-button bg-bee-yellow px-6 text-lg font-black text-bee-black transition-colors hover:bg-bee-yellow-bright active:bg-bee-amber disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("onb.finish")}
          </button>
          <button
            type="button"
            onClick={() => onFinish(false)}
            className="flex min-h-12 w-full items-center justify-center rounded-button border-2 border-bee-black bg-surface px-6 text-base font-bold transition-colors hover:bg-surface-alt"
          >
            {t("onb.setupLater")}
          </button>
        </div>
      </form>
    </section>
  );
}

function BackHeader({
  t,
  onBack,
  title,
}: {
  t: T;
  onBack: () => void;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={onBack}
        className="flex min-h-10 w-fit items-center gap-2 rounded-button pr-3 text-base font-bold text-text-muted transition-colors hover:bg-surface-alt"
      >
        <ArrowLeft aria-hidden="true" className="h-5 w-5" />
        {t("onb.back")}
      </button>
      <h1 className="text-3xl font-black leading-tight tracking-tight">
        {title}
      </h1>
    </div>
  );
}
