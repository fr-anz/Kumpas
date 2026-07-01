import Image from "next/image";

export function BeeLogo({
  className = "",
  src = "/kumpas_logo.svg",
  title = "Kumpas",
}: {
  className?: string;
  src?: string;
  title?: string;
}) {
  return (
    <Image
      src={src}
      alt={title}
      width={112}
      height={112}
      className={className}
      unoptimized
    />
  );
}
