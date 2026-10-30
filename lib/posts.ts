import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { imageSize } from 'image-size';
import { editorialFor, retirementFor } from './editorial';
import { categoryById, inferCategory, TRAVEL_CATEGORIES, type CategoryId } from './taxonomy';
import type { EditorialGuide } from './content-types';

export interface PostMetadata {
  id: string;
  slug: string;
  title: string;
  date: string;
  publicationStatus: 'verified-release' | 'legacy-declared';
  updated?: string;
  checkedAt?: string;
  excerpt: string;
  category: string;
  categoryId: CategoryId;
  legacyCategory: string;
  image?: string;
  author?: string;
  tags: string[];
  readTime?: string;
  featured?: boolean;
  featuredOrder?: number;
  deepDive?: boolean;
  deepDiveOrder?: number;
  editorial?: EditorialGuide;
  reviewed: boolean;
  indexable: boolean;
}
export interface Post extends PostMetadata {
  content: string;
}
const directories = ['content/posts', 'content/deep-dive'].map((d) => path.join(process.cwd(), d));
const dimensions = new Map<string, { width: number; height: number } | null>();
let staticInventory: Post[] | undefined;
export function getImageDimensions(imagePath?: string): { width: number; height: number } | null {
  if (!imagePath?.startsWith('/')) return null;
  if (dimensions.has(imagePath)) return dimensions.get(imagePath)!;
  try {
    const size = imageSize(fs.readFileSync(path.join(process.cwd(), 'public', imagePath.slice(1))));
    const value = size.width && size.height ? { width: size.width, height: size.height } : null;
    dimensions.set(imagePath, value);
    return value;
  } catch {
    dimensions.set(imagePath, null);
    return null;
  }
}
function iso(value: unknown): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : undefined;
}
function inventory(): Post[] {
  if (process.env.NODE_ENV !== 'development' && staticInventory) return staticInventory;
  const posts: Post[] = [];
  const seen = new Set<string>();
  for (const directory of directories) {
    if (!fs.existsSync(directory)) continue;
    for (const file of fs
      .readdirSync(directory)
      .filter((f) => f.endsWith('.md'))
      .sort()) {
      const slug = file.slice(0, -3);
      const { data, content } = matter(fs.readFileSync(path.join(directory, file), 'utf8'));
      if (!content.trim() || data.draft === true || data.status === 'draft' || retirementFor(slug))
        continue;
      if (seen.has(slug)) throw new Error(`Duplicate published slug: ${slug}`);
      seen.add(slug);
      const editorial = editorialFor(slug);
      const title = String(data.title || slug);
      const legacyCategory = String(data.category || 'Uncategorized');
      const categoryId = editorial?.categoryId || inferCategory(legacyCategory, title);
      const date = iso(data.date);
      if (!date) throw new Error(`Missing/invalid publication date: ${slug}`);
      posts.push({
        id: editorial?.id || String(data.id || `guide:${slug}`),
        slug,
        title,
        date,
        publicationStatus: editorial?.changeType === 'new' ? 'verified-release' : 'legacy-declared',
        updated: iso(data.updated),
        checkedAt: editorial?.checkedAt,
        excerpt: String(data.excerpt || data.description || ''),
        category: categoryById(categoryId)!.name,
        categoryId,
        legacyCategory,
        image: typeof data.image === 'string' ? data.image : undefined,
        author: data.author || 'Korea Experience Editorial',
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        readTime: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 220))} min read`,
        featured: Boolean(data.featured),
        featuredOrder: data.featuredOrder,
        deepDive: Boolean(data.deepDive),
        deepDiveOrder: data.deepDiveOrder,
        editorial,
        reviewed: Boolean(editorial),
        indexable: data.noindex !== true,
        content,
      });
    }
  }
  posts.sort(
    (a, b) =>
      Date.parse(b.updated || b.date) - Date.parse(a.updated || a.date) ||
      a.slug.localeCompare(b.slug),
  );
  if (process.env.NODE_ENV !== 'development') staticInventory = posts;
  return posts;
}
export function getAllPosts(): PostMetadata[] {
  return inventory().map(({ content: _content, ...metadata }) => metadata);
}
export function getPostBySlug(slug: string): Post | null {
  return inventory().find((p) => p.slug === slug) || null;
}
export function getLaunchGuides(): PostMetadata[] {
  return getAllPosts()
    .filter((p) => p.reviewed)
    .sort((a, b) => a.editorial!.launchOrder - b.editorial!.launchOrder);
}
export function getPostsByCategory(category: string): PostMetadata[] {
  return getAllPosts().filter(
    (p) => p.category === category || p.categoryId === category || p.legacyCategory === category,
  );
}
export function getAllCategories(): string[] {
  return TRAVEL_CATEGORIES.map((c) => c.name);
}
export function getRelatedPosts(currentSlug: string, limit = 3): PostMetadata[] {
  const posts = getAllPosts();
  const current = posts.find((p) => p.slug === currentSlug);
  if (!current) return [];
  const curated = (current.editorial?.relations || []).flatMap((r) => {
    const p = posts.find((p) => p.slug === r.slug);
    return p ? [p] : [];
  });
  if (curated.length >= limit) return curated.slice(0, limit);
  const used = new Set([currentSlug, ...curated.map((p) => p.slug)]);
  const context = current.editorial;
  const fallback = posts
    .filter((p) => !used.has(p.slug) && p.reviewed)
    .map((post) => {
      const e = post.editorial!;
      const region = context?.regions.some((r) => e.regions.includes(r)) ? 3 : 0;
      const interests = context?.interests.filter((i) => e.interests.includes(i)).length || 0;
      return {
        post,
        score: region + interests * 2 + (post.categoryId === current.categoryId ? 2 : 0),
      };
    })
    .filter((x) => x.score >= 3)
    .sort((a, b) => b.score - a.score || a.post.slug.localeCompare(b.post.slug));
  return [...curated, ...fallback.map((x) => x.post)].slice(0, limit);
}
export function getFeaturedPosts() {
  return TRAVEL_CATEGORIES.flatMap((c) =>
    getLaunchGuides()
      .filter((p) => p.categoryId === c.slug)
      .slice(0, 1),
  );
}
export function getDeepDivePosts(limit = 3) {
  return getLaunchGuides().slice(0, limit);
}
export function getLatestDeepDivePerCategory(excludeSlugs: string[] = [], perCategory = 1) {
  return TRAVEL_CATEGORIES.flatMap((c) =>
    getLaunchGuides()
      .filter((p) => p.categoryId === c.slug && !excludeSlugs.includes(p.slug))
      .slice(0, perCategory),
  );
}
