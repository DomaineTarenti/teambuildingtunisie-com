import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/mdx';

const BASE = 'https://teambuildingtunisie.com';
const LOCALES = ['fr', 'en'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = LOCALES.flatMap((locale) => [
    { url: `${BASE}/${locale}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${BASE}/${locale}/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
  ]);

  const blogRoutes = LOCALES.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({
      url: `${BASE}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...staticRoutes, ...blogRoutes];
}
