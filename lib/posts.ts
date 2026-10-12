import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { imageSize } from 'image-size';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const deepDiveDirectory = path.join(process.cwd(), 'content/deep-dive');
const publicDir = path.join(process.cwd(), 'public');

// Cache image dimensions at build time to avoid repeated disk reads
const dimensionCache = new Map<string, { width: number; height: number } | null>();

export function getImageDimensions(imagePath?: string): { width: number; height: number } | null {
  if (!imagePath) return null;
  if (dimensionCache.has(imagePath)) return dimensionCache.get(imagePath)!;

  try {
    // imagePath is like '/images/foo.webp' — strip leading slash
    const rel = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const abs = path.join(publicDir, rel);
    if (!fs.existsSync(abs)) {
      dimensionCache.set(imagePath, null);
      return null;
    }
    const buf = fs.readFileSync(abs);
    const { width, height } = imageSize(buf);
    if (!width || !height) {
      dimensionCache.set(imagePath, null);
      return null;
    }
    const dims = { width, height };
    dimensionCache.set(imagePath, dims);
    return dims;
  } catch {
    dimensionCache.set(imagePath, null);
    return null;
  }
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  content: string;
  image?: string;
  author?: string;
  tags?: string[];
  readTime?: string;
  featured?: boolean;
  featuredOrder?: number;
  deepDive?: boolean;
  deepDiveOrder?: number;
}

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  image?: string;
  author?: string;
  tags?: string[];
  readTime?: string;
  featured?: boolean;
  featuredOrder?: number;
  deepDive?: boolean;
  deepDiveOrder?: number;
}

// Helper function to read posts from a directory
function readPostsFromDirectory(directory: string): PostMetadata[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const fileNames = fs.readdirSync(directory);
  const posts: PostMetadata[] = [];
  
  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;
    try {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(directory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Empty Markdown files should never become indexable pages or sitemap URLs.
      if (!content.trim()) {
        continue;
      }

      posts.push({
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || data.description || '',
        category: data.category || 'Uncategorized',
        image: data.image,
        author: data.author,
        tags: data.tags || [],
        readTime: data.readTime,
        featured: data.featured || false,
        featuredOrder: data.featuredOrder,
        deepDive: data.deepDive || false,
        deepDiveOrder: data.deepDiveOrder,
      });
    } catch (error) {
      console.error(`Error parsing ${fileName}:`, error);
    }
  }

  return posts;
}

// Get all blog posts (from both posts and deep-dive directories)
export function getAllPosts(): PostMetadata[] {
  try {
    const regularPosts = readPostsFromDirectory(postsDirectory);
    const deepDivePosts = readPostsFromDirectory(deepDiveDirectory);
    
    const allPostsData = [...regularPosts, ...deepDivePosts];

    // Sort posts by date
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

// Get a single post by slug (searches both directories)
export function getPostBySlug(slug: string): Post | null {
  try {
    // Try regular posts first
    let fullPath = path.join(postsDirectory, `${slug}.md`);
    
    // If not found, try deep-dive
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(deepDiveDirectory, `${slug}.md`);
    }
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // A directly requested empty post is not a published article.
    if (!content.trim()) {
      return null;
    }

    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || data.description || '',
      category: data.category || 'Uncategorized',
      content,
      image: data.image,
      author: data.author,
      tags: data.tags || [],
      readTime: data.readTime,
      featured: data.featured || false,
      featuredOrder: data.featuredOrder,
      deepDive: data.deepDive || false,
      deepDiveOrder: data.deepDiveOrder,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

// Get posts by category
export function getPostsByCategory(category: string): PostMetadata[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

// Get all unique categories
export function getAllCategories(): string[] {
  const allPosts = getAllPosts();
  const categories = allPosts.map((post) => post.category);
  return Array.from(new Set(categories));
}

// Get related posts based on actual topic overlap, not date adjacency.
export function getRelatedPosts(currentSlug: string, limit: number = 6): PostMetadata[] {
  const allPosts = getAllPosts();
  const currentPost = allPosts.find((p) => p.slug === currentSlug);
  if (!currentPost) return [];

  const stopWords = new Set([
    'about', 'after', 'also', 'been', 'best', 'from', 'have', 'into', 'korea',
    'korean', 'more', 'most', 'your', 'guide', '2026', 'with', 'this', 'that',
    'their', 'what', 'when', 'where', 'which', 'while', 'will', 'visit', 'living',
  ]);
  const getTopicTokens = (post: PostMetadata) =>
    `${post.title} ${post.excerpt}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 4 && !stopWords.has(token));

  const currentTokens = new Set(getTopicTokens(currentPost));
  return allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const sharedTokens = new Set(getTopicTokens(post).filter((token) => currentTokens.has(token)));
      return {
        post,
        sharedCount: sharedTokens.size,
        sameCategory: post.category === currentPost.category,
      };
    })
    // Do not fill slots with unrelated articles merely to reach a fixed link count.
    .filter(({ sharedCount }) => sharedCount > 0)
    .sort((a, b) =>
      b.sharedCount - a.sharedCount || Number(b.sameCategory) - Number(a.sameCategory)
    )
    .slice(0, limit)
    .map(({ post }) => post);
}

// Get featured posts for homepage - now returns Deep Dive posts, one per category
export function getFeaturedPosts(): PostMetadata[] {
  const allPosts = getAllPosts();
  
  // Curated list of best Deep Dive articles, one per category
  const featuredDeepDiveSlugs = [
    'exosome-therapy-seoul-guide-2026',           // Medical Tourism
    'korea-cherry-blossom-forecast-2026',         // Travel & Tourism
    'catchtable-global-michelin-reservation-guide-2026', // Food & Dining
    'korea-social-rules-local-guide-2026',        // K-Culture
    'olive-young-must-buys-2026',                 // Shopping & K-Beauty
    'seoul-transit-climate-card-vs-tmoney-2026',  // Living in Korea
  ];
  
  // Return posts in the curated order
  const featuredPosts: PostMetadata[] = [];
  for (const slug of featuredDeepDiveSlugs) {
    const post = allPosts.find((p) => p.slug === slug);
    if (post) {
      featuredPosts.push(post);
    }
  }
  
  return featuredPosts;
}

// Get Deep Dive posts for homepage
export function getDeepDivePosts(limit: number = 3): PostMetadata[] {
  const allPosts = getAllPosts();
  
  // Filter deep dive posts and sort by deepDiveOrder, then by date
  const deepDivePosts = allPosts
    .filter((post) => post.deepDive === true)
    .sort((a, b) => {
      // First sort by deepDiveOrder if both have it
      if (a.deepDiveOrder !== undefined && b.deepDiveOrder !== undefined) {
        return a.deepDiveOrder - b.deepDiveOrder;
      }
      // Then by date (newest first)
      return a.date < b.date ? 1 : -1;
    });
  
  return deepDivePosts.slice(0, limit);
}

// Get the latest deep dive post per category, excluding given slugs
export function getLatestDeepDivePerCategory(excludeSlugs: string[] = [], perCategory: number = 2): PostMetadata[] {
  const allPosts = getAllPosts();
  const excluded = new Set(excludeSlugs);

  const deepDivePosts = allPosts
    .filter((p) => p.deepDive === true && !excluded.has(p.slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const countMap = new Map<string, number>();
  const result: PostMetadata[] = [];

  for (const post of deepDivePosts) {
    const count = countMap.get(post.category) ?? 0;
    if (count < perCategory) {
      countMap.set(post.category, count + 1);
      result.push(post);
    }
  }

  return result;
}
