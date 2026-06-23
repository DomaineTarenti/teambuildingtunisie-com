import { getTranslations } from 'next-intl/server';

export default async function Footer() {
  const t = await getTranslations('footer');
  return (
    <footer className="bg-secondary text-white/40 py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p>{t('copyright')}</p>
        <a href="#" className="hover:text-white/70 transition-colors">
          {t('legal')}
        </a>
      </div>
    </footer>
  );
}
