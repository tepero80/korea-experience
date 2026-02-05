import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface SearchIndexItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  deepDive?: boolean;
}

const postsDirectory = path.join(process.cwd(), 'content/posts');
const deepDiveDirectory = path.join(process.cwd(), 'content/deep-dive');
const outputPath = path.join(process.cwd(), 'public/search-index.json');

console.log('🔍 Generating search index...');

try {
  // Check if posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.error('❌ Posts directory not found:', postsDirectory);
    process.exit(1);
  }

  // Read regular posts
  const postFileNames = fs.readdirSync(postsDirectory);
  const postMdFiles = postFileNames.filter(file => file.endsWith('.md'));
  
  // Read deep dive posts
  const deepDiveFiles: string[] = [];
  if (fs.existsSync(deepDiveDirectory)) {
    const deepDiveFileNames = fs.readdirSync(deepDiveDirectory);
    deepDiveFiles.push(...deepDiveFileNames.filter(file => file.endsWith('.md')));
  }
  
  console.log(`📚 Found ${postMdFiles.length} blog posts`);
  console.log(`🔬 Found ${deepDiveFiles.length} deep dive posts`);

  // Process regular posts
  const postIndex: SearchIndexItem[] = postMdFiles.map(fileName => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Extract first 1000 characters of content for search (performance)
    const searchContent = content
      .replace(/[#*_`]/g, '') // Remove markdown formatting
      .replace(/\n+/g, ' ')   // Replace newlines with spaces
      .slice(0, 1000)
      .trim();

    return {
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || data.description || '',
      category: data.category || 'Uncategorized',
      content: searchContent,
      deepDive: false
    };
  });

  // Process deep dive posts
  const deepDiveIndex: SearchIndexItem[] = deepDiveFiles.map(fileName => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(deepDiveDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Extract first 1000 characters of content for search (performance)
    const searchContent = content
      .replace(/[#*_`]/g, '') // Remove markdown formatting
      .replace(/\n+/g, ' ')   // Replace newlines with spaces
      .slice(0, 1000)
      .trim();

    return {
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || data.description || '',
      category: data.category || 'Uncategorized',
      content: searchContent,
      deepDive: true
    };
  });

  // Combine and prioritize Deep Dive posts
  const searchIndex = [...deepDiveIndex, ...postIndex];

  // Write search index to public folder
  fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2));
  
  const fileSizeKB = (fs.statSync(outputPath).size / 1024).toFixed(2);
  console.log(`✅ Search index generated successfully!`);
  console.log(`   📄 ${searchIndex.length} posts indexed`);
  console.log(`   💾 File size: ${fileSizeKB} KB`);
  console.log(`   📍 Location: ${outputPath}`);

} catch (error) {
  console.error('❌ Error generating search index:', error);
  process.exit(1);
}
