import fs from 'node:fs';
import { getAllPosts, getPostBySlug } from '../lib/posts';
const posts = getAllPosts();
const catalog = posts.map(({ id, slug, title, category, reviewed, indexable }) => ({
  id,
  slug,
  title,
  category,
  reviewed,
  indexable,
}));
fs.writeFileSync('public/content-catalog.json', JSON.stringify(catalog));
fs.writeFileSync('data/content-ids.json', JSON.stringify(catalog.map((p) => p.id)));
fs.writeFileSync(
  'public/search-index.json',
  JSON.stringify(
    posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      reviewed: p.reviewed,
      content: getPostBySlug(p.slug)!
        .content.replace(/<[^>]+>/g, ' ')
        .replace(/[#*_`]/g, '')
        .replace(/\s+/g, ' ')
        .slice(0, 900),
    })),
  ),
);
console.log('Search and public catalog: ' + posts.length + ' guides.');
