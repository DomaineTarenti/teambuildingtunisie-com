import { getTranslations } from 'next-intl/server';

export default async function Hero() {
  const t = await getTranslations('hero');
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80')" }}
      />
      <div className="absolute inset-0 bg-secondary/70" />
      <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-primary/10 rounded-tl-full" />
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="inline-block bg-primary/20 text-primary border border-primary/30 rounded-full px-4 py-1 text-sm font-medium mb-6">
          Tunisie · Outdoor · Culinaire · Créatif
        </div>
        <h1 className="font-heading font-bold text-5xl md:text-7xl mb-6 leading-tight">
          {t('title')}
        </h1>
        <p className="text-xl md:text-2xl text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>
        <a
          href="#contact"
          className="inline-block bg-primary text-white font-heading font-bold text-lg px-10 py-4 rounded-full hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/30"
        >
          {t('cta')}
        </a>
      </div>
    </section>
  );
}
