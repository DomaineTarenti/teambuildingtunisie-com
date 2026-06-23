import path from 'path';
import fs from 'fs';
import { getAllPosts, getPostBySlug } from '@/lib/mdx';

const testDir = path.join(process.cwd(), 'content/blog/fr');
const testFile = path.join(testDir, 'test-article-temp.mdx');

beforeAll(() => {
  fs.mkdirSync(testDir, { recursive: true });
  fs.writeFileSync(
    testFile,
    `---\ntitle: Test Article\ndate: 2026-01-15\nexcerpt: A short excerpt.\ncoverImage: https://images.unsplash.com/photo-1?w=1200&q=80\n---\n\nThis is the article content.`
  );
});

afterAll(() => {
  fs.rmSync(testFile, { force: true });
});

describe('getAllPosts', () => {
  it('returns an array for a valid locale', () => {
    const posts = getAllPosts('fr');
    expect(Array.isArray(posts)).toBe(true);
  });

  it('includes the test article', () => {
    const posts = getAllPosts('fr');
    expect(posts.some((p) => p.slug === 'test-article-temp')).toBe(true);
  });

  it('returns posts sorted newest first', () => {
    const posts = getAllPosts('fr');
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(new Date(posts[i].date).getTime());
    }
  });

  it('returns empty array for unknown locale', () => {
    const posts = getAllPosts('zz-unknown-locale-9999');
    expect(posts).toEqual([]);
  });
});

describe('getPostBySlug', () => {
  it('returns correct frontmatter', () => {
    const post = getPostBySlug('fr', 'test-article-temp');
    expect(post.title).toBe('Test Article');
    expect(post.excerpt).toBe('A short excerpt.');
  });

  it('returns content', () => {
    const post = getPostBySlug('fr', 'test-article-temp');
    expect(post.content).toContain('This is the article content.');
  });

  it('throws for unknown slug', () => {
    expect(() => getPostBySlug('fr', 'non-existent-9999')).toThrow();
  });
});
