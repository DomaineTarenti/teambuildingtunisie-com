'use client';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale = locale === 'fr' ? 'en' : 'fr';
  const otherPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-heading font-bold text-xl text-white">
          Team Building<span className="text-primary"> Tunisie</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href={`/${locale}/blog`}
            className="text-white/80 hover:text-primary transition-colors text-sm font-medium"
          >
            {t('blog')}
          </Link>
          <Link
            href={otherPath}
            className="text-white/60 hover:text-white text-xs font-medium border border-white/20 rounded px-2 py-1 transition-colors"
          >
            {otherLocale.toUpperCase()}
          </Link>
          <a
            href="#contact"
            className="bg-primary text-white font-medium text-sm px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
          >
            {t('cta')}
          </a>
        </nav>
      </div>
    </header>
  );
}
