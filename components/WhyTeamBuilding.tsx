import { getTranslations } from 'next-intl/server';

const icons = {
  cohesion: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  performance: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  wellbeing: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
};

export default async function WhyTeamBuilding() {
  const t = await getTranslations('why');
  const items = ['cohesion', 'performance', 'wellbeing'] as const;

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-secondary text-center mb-16">
          {t('title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item) => {
            const titleKey = `${item}.title` as const;
            const textKey = `${item}.text` as const;
            return (
              <div key={item} className="text-center p-8 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-shadow border border-brand/5">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
                  {icons[item]}
                </div>
                <h3 className="font-heading font-bold text-xl text-secondary mb-3">
                  {t(titleKey)}
                </h3>
                <p className="text-brand/65 leading-relaxed text-sm">
                  {t(textKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
