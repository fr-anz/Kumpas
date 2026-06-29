type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section aria-labelledby="page-title">
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-[#46736a]">
        Foundation ready
      </p>
      <h1
        id="page-title"
        className="max-w-xl text-4xl font-black tracking-[-0.05em] sm:text-5xl"
      >
        {title}
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-8 text-[#53615f]">
        {description}
      </p>
    </section>
  );
}
