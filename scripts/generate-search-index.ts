import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface SearchIndexItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'content/posts');
const outputPath = path.join(process.cwd(), 'public/search-index.json');

console.log('🔍 Generating search index...');

try {
  // Check if posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.error('❌ Posts directory not found:', postsDirectory);
    process.exit(1);
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const mdFiles = fileNames.filter(file => file.endsWith('.md'));
  
  console.log(`📚 Found ${mdFiles.length} blog posts`);

  const searchIndex: SearchIndexItem[] = mdFiles.map(fileName => {
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
      content: searchContent
    };
  });

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
