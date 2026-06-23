import { getPostBySlug, getAllPosts, type Post } from '@/lib/mdx';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Params = { locale: string; slug: string };

export async function generateStaticParams({ params: { locale } }: { params: { locale: string } }) {
  return getAllPosts(locale).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params: { locale, slug } }: { params: Params }): Promise<Metadata> {
  try {
    const post = getPostBySlug(locale, slug);
    return {
      title: `${post.title} | Team Building Tunisie`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        images: post.coverImage ? [{ url: post.coverImage }] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params: { locale, slug } }: { params: Params }) {
  let post: Post | undefined;
  try {
    post = getPostBySlug(locale, slug);
  } catch {
    notFound();
  }
  if (!post) notFound(); // TypeScript guard — runtime never reaches here

  return (
    <main className="pt-24 pb-20 bg-background">
      <article className="max-w-3xl mx-auto px-4">
        <Link
          href={`/${locale}/blog`}
          className="inline-block text-brand/50 hover:text-primary text-sm mb-8 transition-colors"
        >
          ← Blog
        </Link>
        {post.coverImage && (
          <div
            className="h-64 md:h-96 rounded-2xl bg-cover bg-center mb-10"
            style={{ backgroundImage: `url('${post.coverImage}')` }}
          />
        )}
        <time className="text-sm text-brand/40 mb-4 block">
          {new Date(post.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </time>
        <h1 className="font-heading font-bold text-4xl md:text-5xl text-secondary mb-10 leading-tight">
          {post.title}
        </h1>
        <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-secondary prose-a:text-inherit prose-a:no-underline hover:prose-a:no-underline prose-p:text-brand/80 prose-p:leading-relaxed">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </main>
  );
}
