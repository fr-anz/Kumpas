"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useFontSize } from "@/components/FontSizeProvider";
import { BeeLogo } from "@/components/BeeLogo";
import { PhFlag } from "@/components/PhFlag";
import { loadProfile, saveProfile } from "@/services/storageService";
import {
  toNationalDigits,
  isValidNationalNumber,
  formatNationalInput,
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
  // `contact` holds the 10-digit national number (no +63, no leading 0).
  const [contact, setContact] = useState(() =>
    toNationalDigits(existing?.emergencyContactNumber ?? ""),
  );

  const finish = (withProfile: boolean) => {
    if (withProfile && (name.trim() || contact)) {
      // Store E.164 when the national number is valid, else store what we have.
      const number = isValidNationalNumber(contact)
        ? `+63${contact}`
        : contact
          ? `+63${contact}`
          : "";
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
    <div className="relative z-10 mx-auto flex min-h-dvh max-w-xl flex-col px-5 py-8 sm:px-8">
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
      className="flex min-h-14 w-full items-center justify-center gap-2 rounded-button bg-bee-yellow px-6 text-lg font-black text-bee-black transition-all border-2 border-border-lining shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:bg-bee-yellow-bright active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--shadow-color)]"
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
        <h1 className="text-center font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
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
          className="grid grid-cols-2 gap-1 rounded-pill border-2 border-border-lining bg-surface p-1 shadow-[4px_4px_0px_0px_var(--shadow-color)]"
          role="group"
          aria-label={t("onb.language")}
        >
          {(["en", "fil"] as Language[]).map((lng) => (
            <button
              key={lng}
              type="button"
              onClick={() => setLanguage(lng)}
              aria-pressed={language === lng}
              className={`min-h-12 rounded-pill px-4 text-base font-bold transition-all ${
                language === lng
                  ? "bg-bee-yellow text-bee-black border-2 border-border-lining shadow-[2px_2px_0px_0px_var(--shadow-color)]"
                  : "text-text hover:bg-surface-alt border-2 border-transparent"
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
              className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-card border-2 p-2 transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--shadow-color)] ${
                fontSize === s.value
                  ? "border-border-lining bg-bee-yellow shadow-[4px_4px_0px_0px_var(--shadow-color)]"
                  : "border-border-lining bg-surface shadow-[4px_4px_0px_0px_var(--shadow-color)]"
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
  // `contact` is the raw national number (digits only, max 10).
  const complete = contact.length === 10;
  const validNumber = isValidNationalNumber(contact);
  const showError = complete && !validNumber;
  const canFinish = !contact || validNumber;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip non-digits and cap at 10; anything beyond is silently ignored.
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setContact(digits);
  };

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
            className="min-h-12 rounded-button border-2 border-border-lining bg-surface px-4 text-lg shadow-[4px_4px_0px_0px_var(--shadow-color)] focus:outline-none transition-all"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-bold">{t("onb.contactNumber")}</span>
          <div
            className={`flex min-h-12 items-center gap-2 rounded-button border-2 bg-surface pl-3 pr-4 shadow-[4px_4px_0px_0px_var(--shadow-color)] focus-within:outline-none transition-all ${
              showError
                ? "border-danger"
                : validNumber
                  ? "border-success"
                  : "border-border-lining"
            }`}
          >
            {/* +63 prefix with flag */}
            <span className="flex shrink-0 items-center gap-1.5 border-r border-border pr-2 font-bold">
              <PhFlag className="h-4 w-6 rounded-[2px]" />
              +63
            </span>
            <input
              type="tel"
              inputMode="numeric"
              value={formatNationalInput(contact)}
              onChange={handleChange}
              autoComplete="tel-national"
              placeholder="9XX XXX XXXX"
              aria-invalid={showError}
              aria-describedby="contact-feedback"
              style={{ outline: "none", boxShadow: "none" }}
              className="min-w-0 flex-1 border-0 bg-transparent px-5 py-2 text-lg tracking-wide"
            />
          </div>
          <span id="contact-feedback" className="min-h-5 text-sm font-semibold">
            {validNumber ? (
              <span className="flex items-center gap-1.5 text-success">
                <Check aria-hidden="true" className="h-4 w-4" />
                {t("onb.contactValid")}
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
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-button bg-bee-yellow px-6 text-lg font-black text-bee-black transition-all border-2 border-bee-black shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:bg-bee-yellow-bright active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--shadow-color)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("onb.finish")}
          </button>
          <button
            type="button"
            onClick={() => onFinish(false)}
            className="flex min-h-12 w-full items-center justify-center rounded-button border-2 border-bee-black bg-surface px-6 text-base font-bold transition-all shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:bg-surface-alt active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--shadow-color)]"
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
