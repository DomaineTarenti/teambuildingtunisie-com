import { getTranslations } from 'next-intl/server';
import InvisibleLink from './InvisibleLink';

const activities = [
  {
    key: 'outdoor',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    link: 'https://domainetarenti.com',
  },
  {
    key: 'culinary',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    link: 'https://atelier-evenementiel-tunisie.com',
  },
  {
    key: 'creative',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
    link: 'https://atelier-evenementiel-tunisie.com',
  },
  {
    key: 'sports',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
    link: 'https://atelier-evenementiel-tunisie.com',
  },
  {
    key: 'wellbeing',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    link: 'https://domainetarenti.com',
  },
  {
    key: 'custom',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    link: 'https://atelier-evenementiel-tunisie.com',
  },
] as const;

export default async function Activities() {
  const t = await getTranslations('activities');

  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-white text-center mb-16">
          {t('title')}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map(({ key, image, link }) => (
            <InvisibleLink key={key} href={link}>
              <div className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${image}')` }}
                />
                <div className="absolute inset-0 bg-secondary/50 group-hover:bg-primary/60 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-end p-6">
                  <h3 className="font-heading font-bold text-white text-lg">
                    {t(key)}
                  </h3>
                </div>
              </div>
            </InvisibleLink>
          ))}
        </div>
      </div>
    </section>
  );
}
