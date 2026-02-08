import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const deepDiveDirectory = path.join(process.cwd(), 'content/deep-dive');

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  content: string;
  image?: string;
  author?: string;
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
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(directory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || data.description || '',
        category: data.category || 'Uncategorized',
        image: data.image,
        author: data.author,
        featured: data.featured || false,
        featuredOrder: data.featuredOrder,
        deepDive: data.deepDive || false,
        deepDiveOrder: data.deepDiveOrder,
      };
    });
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

    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || data.description || '',
      category: data.category || 'Uncategorized',
      content,
      image: data.image,
      author: data.author,
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

// Get related posts — guaranteed doubly-linked chain within each category
// Post[i] ALWAYS recommends Post[i-1] and Post[i+1], forming an unbroken chain
// Google crawler visiting any single post can traverse the entire category
export function getRelatedPosts(currentSlug: string, limit: number = 6): PostMetadata[] {
  const allPosts = getAllPosts();
  const currentPost = allPosts.find((p) => p.slug === currentSlug);
  if (!currentPost) return [];

  // Same category sorted by date (newest first), INCLUDING current post for index lookup
  const sameCatSorted = allPosts
    .filter((p) => p.category === currentPost.category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const currentIdx = sameCatSorted.findIndex((p) => p.slug === currentSlug);
  const result: PostMetadata[] = [];
  const usedSlugs = new Set([currentSlug]);

  // 1) Immediate prev & next — GUARANTEED chain links (never skipped)
  if (currentIdx > 0) {
    result.push(sameCatSorted[currentIdx - 1]);
    usedSlugs.add(sameCatSorted[currentIdx - 1].slug);
  }
  if (currentIdx < sameCatSorted.length - 1) {
    result.push(sameCatSorted[currentIdx + 1]);
    usedSlugs.add(sameCatSorted[currentIdx + 1].slug);
  }

  // 2) Expand outward from current position to fill remaining slots
  let offset = 2;
  while (result.length < limit && offset < sameCatSorted.length) {
    if (currentIdx - offset >= 0) {
      const p = sameCatSorted[currentIdx - offset];
      if (!usedSlugs.has(p.slug)) {
        result.push(p);
        usedSlugs.add(p.slug);
      }
    }
    if (result.length < limit && currentIdx + offset < sameCatSorted.length) {
      const p = sameCatSorted[currentIdx + offset];
      if (!usedSlugs.has(p.slug)) {
        result.push(p);
        usedSlugs.add(p.slug);
      }
    }
    offset++;
  }

  // 3) If same category not enough, fill from other categories (date-proximity)
  if (result.length < limit) {
    const currentDate = new Date(currentPost.date).getTime();
    const otherCatPosts = allPosts
      .filter((p) => !usedSlugs.has(p.slug) && p.category !== currentPost.category)
      .sort(
        (a, b) =>
          Math.abs(new Date(a.date).getTime() - currentDate) -
          Math.abs(new Date(b.date).getTime() - currentDate)
      )
      .slice(0, limit - result.length);
    result.push(...otherCatPosts);
  }

  return result.slice(0, limit);
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
