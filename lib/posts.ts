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

// Get related posts (same category, excluding current post)
export function getRelatedPosts(currentSlug: string, category: string, limit: number = 3): PostMetadata[] {
  const allPosts = getAllPosts();
  
  // Filter: same category, not current post
  const sameCategoryPosts = allPosts.filter(
    (post) => post.category === category && post.slug !== currentSlug
  );
  
  // Shuffle array to get random posts
  const shuffled = sameCategoryPosts.sort(() => Math.random() - 0.5);
  
  // If not enough posts in same category, add random posts from other categories
  if (shuffled.length < limit) {
    const otherPosts = allPosts
      .filter((post) => post.category !== category && post.slug !== currentSlug)
      .sort(() => Math.random() - 0.5);
    
    return [...shuffled, ...otherPosts].slice(0, limit);
  }
  
  // Return limited number of posts
  return shuffled.slice(0, limit);
}

// Get featured posts for homepage
export function getFeaturedPosts(): PostMetadata[] {
  const allPosts = getAllPosts();
  
  // Filter featured posts and sort by featuredOrder
  const featuredPosts = allPosts
    .filter((post) => post.featured === true)
    .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999));
  
  // Return up to 6 featured posts
  return featuredPosts.slice(0, 6);
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
