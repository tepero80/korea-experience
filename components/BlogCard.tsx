import Link from 'next/link';
import { PostMetadata } from '@/lib/posts';

interface BlogCardProps {
  post: PostMetadata;
}

export default function BlogCard({ post }: BlogCardProps) {
  const { slug, title, excerpt, category, date } = post;
  
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-500 overflow-hidden flex items-center justify-center">
        <div className="text-white text-4xl font-bold opacity-20">
          {category}
        </div>
      </div>
      
      <div className="p-6">
        <div className="text-sm text-blue-600 font-semibold mb-2">
          {category}
        </div>
        <h2 className="text-xl font-bold mb-2 line-clamp-2">
          <Link 
            href={`/blog/${slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {title}
          </Link>
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {excerpt}
        </p>
        <div className="flex items-center justify-between">
          <time className="text-sm text-gray-500">
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <Link 
            href={`/blog/${slug}`}
            className="text-sm text-blue-600 font-semibold hover:text-blue-700"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
}
