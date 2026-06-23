import { getTranslations } from 'next-intl/server';

export default async function ClientLogos() {
  const t = await getTranslations('clients');
  return (
    <section className="py-20 bg-background border-y border-brand/5">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-brand/40 text-sm font-medium uppercase tracking-widest mb-10">
          {t('title')}
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-10 bg-secondary/8 rounded-lg flex items-center justify-center"
            >
              <span className="text-secondary/20 font-heading text-xs font-bold tracking-wider">LOGO</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
