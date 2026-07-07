"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Siren, MessageSquare, Camera, Clock, User, Volume2 } from "lucide-react";
import { categories } from "@/data/categories";
import { CategoryCard } from "@/components/CategoryCard";
import { InstallBanner } from "@/components/InstallBanner";
import { useLanguage } from "@/i18n/LanguageProvider";
import { loadRecents } from "@/utils/recentPhrases";
import { getPhraseById } from "@/data/phrases";
import type { Phrase } from "@/types/phrase";
import { loadProfile, saveProfile } from "@/services/storageService";
import type { UserProfile } from "@/types/userProfile";
import { speak } from "@/services/speechService";
import { speechLang } from "@/i18n/translations";

/** Home: emergency action, recent phrases, category grid, quick links. */
export default function HomePage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [recents, setRecents] = useState<Phrase[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    
    const ids = loadRecents();
    const resolved = ids
      .map((id) => getPhraseById(id))
      .filter((p): p is Phrase => !!p);
    setRecents(resolved);
    
    setLoaded(true);
  }, []);

  const emergencyMessage = profile 
    ? (language === "fil" 
        ? `May kapansanan po ako sa pandinig. Ako si ${profile.name}. Paki-kontak ang aking pamilya sa numerong ${profile.emergencyContactNumber}.` 
        : `I am Deaf. My name is ${profile.name}. Please contact my family at ${profile.emergencyContactNumber}.`)
    : t("emergency.message");

  return (
    <div className="flex flex-col gap-6 page-enter pt-4">
      {/* Dismissible PWA install prompt (only when installable) */}
      <InstallBanner />

      {/* PERMANENT INLINE EMERGENCY ID CARD (Replaces Old Button Completely) */}
      {loaded && profile ? (
        <section 
          onClick={() => router.push('/emergency')}
          className="w-full bg-[#e0a800] text-bee-black border-2 border-bee-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-y-1 transition-transform"
        >
          <div className="flex justify-between items-start border-b-2 border-bee-black pb-3 mb-3 gap-3">
            <div className="flex gap-3 sm:gap-4 items-center min-w-0">
              {/* Picture Section */}
              <label 
                className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-full border-2 border-bee-black bg-surface flex items-center justify-center cursor-pointer group"
                onClick={(e) => e.stopPropagation()}
                title="Change Profile Picture"
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const newPhoto = ev.target?.result as string;
                        if (profile) {
                          const updated = { ...profile, photoBase64: newPhoto };
                          setProfile(updated);
                          saveProfile(updated);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {profile.photoBase64 ? (
                  <img src={profile.photoBase64} alt={profile.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-bee-black/30" />
                )}
                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </label>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-bee-black/60 block truncate">EMERGENCY ID CARD</span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-none truncate">{profile.name}</h3>
              </div>
            </div>
            {/* Direct Audio Trigger for Desk Clerks */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                speak(emergencyMessage, speechLang[language]);
              }}
              className="p-3 bg-bee-black text-bee-yellow rounded-xl active:scale-95 transition-transform shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] flex items-center justify-center"
              title={t("emergency.speakMessage")}
              aria-label={t("emergency.speakMessage")}
            >
              <Volume2 className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-2 font-mono text-xs sm:text-sm font-bold text-bee-black/90">
            <p><span className="text-bee-black/50">CONTACT:</span> {profile.emergencyContactName} ({profile.emergencyContactNumber})</p>
            <p><span className="text-bee-black/50">MEDICAL:</span> {profile.medicalNote || (language === "fil" ? "Walang nakatalang kondisyon." : "No medical conditions listed.")}</p>
            <p><span className="text-bee-black/50">BRGY:</span> {profile.addressNote || (language === "fil" ? "Hindi nakasaad." : "Not provided.")}</p>
          </div>
        </section>
      ) : loaded && !profile ? (
         <section className="w-full bg-surface-alt border-2 border-bee-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-3">
            {/* Setup Prompt if no profile exists yet */}
            <p className="font-bold text-lg">{t("emergency.setupTitle")}</p>
            <Link href="/emergency" className="inline-flex min-h-12 items-center justify-center rounded-button bg-bee-yellow px-6 font-black text-bee-black hover:bg-bee-yellow-bright shadow-sm">
              Setup Emergency ID
            </Link>
         </section>
      ) : null}

      {/* Recents row — only shown after the user has visited phrases */}
      {recents.length > 0 && (
        <section aria-labelledby="recents-title" className="flex flex-col">
          <h2
            id="recents-title"
            className="mb-3 flex items-center gap-1.5 text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.12em] text-text-muted shrink-0"
          >
            <Clock aria-hidden="true" className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
            <span>{t("home.recentlyUsed")}</span>
          </h2>
          <div className="grid grid-cols-3 gap-2 pb-2">
            {recents.slice(0, 3).map((phrase) => (
              <Link
                key={phrase.id}
                href={`/communication/${phrase.id}`}
                className="flex min-h-[4rem] w-full items-center justify-center text-center rounded-xl bg-surface px-2 py-2 border-2 border-bee-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                title={language === "fil" ? phrase.titleFil : phrase.title}
              >
                <span className="line-clamp-3 text-[10px] sm:text-xs font-bold leading-[1.15] text-balance">
                  {language === "fil" ? phrase.titleFil : phrase.title}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Phrase categories */}
      <section aria-labelledby="cat-title">
        <h2 id="cat-title" className="mb-3 text-[0.65rem] sm:text-xs font-black uppercase tracking-widest text-text-muted">
          {t("home.phraseCategories")}
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

    </div>
  );
}

