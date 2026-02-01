import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  content: string;
  image?: string;
  author?: string;
}

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  image?: string;
  author?: string;
}

// Get all blog posts
export function getAllPosts(): PostMetadata[] {
  try {
    // Check if posts directory exists
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
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
        };
      });

    // Sort posts by date
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

// Get a single post by slug
export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
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
