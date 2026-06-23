import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isFr = locale === 'fr';
  const title = isFr
    ? 'Team Building Tunisie — Activités & Séminaires d\'entreprise'
    : 'Team Building Tunisia — Corporate Activities & Seminars';
  const description = isFr
    ? 'Organisez des activités de team building inoubliables en Tunisie. Outdoor, culinaire, créatif, sportif. Devis gratuit en 24h.'
    : 'Organize unforgettable team building activities in Tunisia. Outdoor, culinary, creative, sports. Free quote within 24h.';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: isFr ? 'fr_FR' : 'en_US',
      url: `https://teambuildingtunisie.com/${locale}`,
      siteName: 'Team Building Tunisie',
      images: [{ url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80', width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://teambuildingtunisie.com/${locale}`,
      languages: {
        fr: 'https://teambuildingtunisie.com/fr',
        en: 'https://teambuildingtunisie.com/en',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <div className="pt-16">{children}</div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
