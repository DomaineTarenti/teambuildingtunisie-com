import { getTranslations } from 'next-intl/server';
import ExternalLink from './ExternalLink';

const activities = [
  {
    key: 'outdoor',
    image: '/images/blog/team-building-outdoor-tunisie.webp',
    link: 'https://domainetarenti.com',
  },
  {
    key: 'culinary',
    image: '/images/blog/team-building-culinaire-tunisie.webp',
    link: 'https://www.atelier-evenementiel-tunisie.com/',
  },
  {
    key: 'creative',
    image: '/images/blog/atelier-artistique-team-building-tunisie.webp',
    link: 'https://www.atelier-evenementiel-tunisie.com/',
  },
  {
    key: 'sports',
    image: '/images/blog/challenge-sportif-equipe-tunisie.webp',
    link: 'https://www.atelier-evenementiel-tunisie.com/',
  },
  {
    key: 'wellbeing',
    image: '/images/blog/yoga-team-building-tunisie.webp',
    link: 'https://domainetarenti.com',
  },
  {
    key: 'custom',
    image: '/images/blog/team-building-sur-mesure-tunisie.webp',
    link: 'https://www.atelier-evenementiel-tunisie.com/',
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
            <ExternalLink key={key} href={link} className="block">
              <div className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${image}')` }}
                />
                <div className="absolute inset-0 bg-secondary/50 group-hover:bg-primary/60 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-end p-6">
                  <h3 className="font-heading font-bold text-white text-lg">
                    {t(key)} <span aria-hidden="true">↗</span>
                  </h3>
                </div>
              </div>
            </ExternalLink>
          ))}
        </div>
      </div>
    </section>
  );
}
