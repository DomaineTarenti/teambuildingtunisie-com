import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(locale: string): PostMeta[] {
  const dir = path.join(BLOG_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf-8'));
      return {
        slug,
        title: String(data.title ?? ''),
        date: String(data.date ?? ''),
        excerpt: String(data.excerpt ?? ''),
        coverImage: String(data.coverImage ?? ''),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(locale: string, slug: string): Post {
  const filePath = path.join(BLOG_DIR, locale, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? ''),
    date: String(data.date ?? ''),
    excerpt: String(data.excerpt ?? ''),
    coverImage: String(data.coverImage ?? ''),
    content,
  };
}
