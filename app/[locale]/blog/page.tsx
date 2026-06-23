import { getAllPosts } from '@/lib/mdx';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const posts = getAllPosts(locale);
  const t = await getTranslations('blog');

  return (
    <main className="pt-24 pb-20 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="font-heading font-bold text-5xl text-secondary mb-4 text-center">Blog</h1>
        <p className="text-center text-brand/50 mb-16 text-sm">Team Building Tunisie</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="group block">
              <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-brand/5 h-full flex flex-col">
                {post.coverImage && (
                  <div
                    className="h-48 bg-cover bg-center flex-none"
                    style={{ backgroundImage: `url('${post.coverImage}')` }}
                  />
                )}
                <div className="p-6 flex flex-col flex-1">
                  <time className="text-xs text-brand/40 mb-3 block">
                    {new Date(post.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </time>
                  <h2 className="font-heading font-bold text-lg text-secondary mb-3 group-hover:text-primary transition-colors line-clamp-2 flex-1">
                    {post.title}
                  </h2>
                  <p className="text-brand/60 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <span className="mt-4 text-primary text-sm font-medium">{t('readMore')} →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
