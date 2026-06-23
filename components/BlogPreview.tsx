import { getAllPosts } from '@/lib/mdx';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function BlogPreview({ locale }: { locale: string }) {
  const posts = getAllPosts(locale).slice(0, 3);
  const t = await getTranslations('blog');

  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-heading font-bold text-4xl text-white">{t('title')}</h2>
          <Link
            href={`/${locale}/blog`}
            className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
          >
            {t('viewAll')} →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="group block">
              <article className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/40 transition-colors h-full flex flex-col">
                {post.coverImage && (
                  <div
                    className="h-40 bg-cover bg-center flex-none"
                    style={{ backgroundImage: `url('${post.coverImage}')` }}
                  />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <time className="text-white/35 text-xs mb-2 block">
                    {new Date(post.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
                      year: 'numeric', month: 'long',
                    })}
                  </time>
                  <h3 className="font-heading font-bold text-white group-hover:text-primary transition-colors text-base line-clamp-2 flex-1 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-white/40 text-xs line-clamp-2">{post.excerpt}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
