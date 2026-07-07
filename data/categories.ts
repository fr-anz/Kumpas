import type { PhraseCategory } from "@/types/phrase";
import {
  Siren,
  Stethoscope,
  Landmark,
  Bus,
  GraduationCap,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

export type Category = {
  id: PhraseCategory;
  label: string;
  labelFil: string;
  /** Lucide icon used as a consistent, network-free vector icon. */
  icon: LucideIcon;
  description: string;
  descriptionFil: string;
};

export const categories: Category[] = [
  {
    id: "emergency",
    label: "Emergency",
    labelFil: "Saklolo / Emergency",
    icon: Siren,
    description: "Urgent help and safety",
    descriptionFil: "Agarang saklolo at kaligtasan",
  },
  {
    id: "health",
    label: "Health",
    labelFil: "Kalusugan",
    icon: Stethoscope,
    description: "Clinic, pain, medical needs",
    descriptionFil: "Klinika, nararamdamang sakit, at tulong medikal",
  },
  {
    id: "barangay",
    label: "Barangay",
    labelFil: "Barangay at Serbisyo",
    icon: Landmark,
    description: "Documents and local office",
    descriptionFil: "Pagkuha ng mga dokumento at mga lokal na usapin",
  },
  {
    id: "transportation",
    label: "Transportation",
    labelFil: "Biyahe at Direksyon",
    icon: Bus,
    description: "Fare, stops, directions",
    descriptionFil: "Pamasahe, sakayan, at pagtatanong ng daan",
  },
  {
    id: "school",
    label: "School",
    labelFil: "Paaralan",
    icon: GraduationCap,
    description: "Class and campus help",
    descriptionFil: "Komunikasyon sa klase at sa loob ng kampus",
  },
  {
    id: "basic",
    label: "Basic Needs",
    labelFil: "Usapang Pang-araw-araw",
    icon: MessageCircle,
    description: "Everyday communication",
    descriptionFil: "Mga simpleng salita para sa mabilisang pag-uusap",
  },
];

export function getCategory(id: PhraseCategory): Category | undefined {
  return categories.find((category) => category.id === id);
}
