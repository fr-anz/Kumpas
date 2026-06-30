import { notFound } from "next/navigation";
import { getPhraseById, phrases } from "@/data/phrases";
import { CommunicationCard } from "@/components/CommunicationCard";

/** Pre-render a static page for every phrase (required by output: export). */
export function generateStaticParams() {
  return phrases.map((phrase) => ({ phraseId: phrase.id }));
}

export default async function CommunicationPage({
  params,
}: {
  params: Promise<{ phraseId: string }>;
}) {
  const { phraseId } = await params;
  const phrase = getPhraseById(phraseId);

  if (!phrase) {
    notFound();
  }

  return <CommunicationCard phrase={phrase} />;
}
