import Link from 'next/link';
import { PostMetadata } from '@/lib/posts';

interface BlogCardProps {
  post: PostMetadata;
}

export default function BlogCard({ post }: BlogCardProps) {
  const { slug, title, excerpt, category, date } = post;
  
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-br from-blue-600 to-cyan-600 overflow-hidden flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative text-white text-4xl md:text-5xl font-bold drop-shadow-lg text-center px-4 leading-tight">
          {category}
        </div>
      </div>
      
      <div className="p-6">
        <div className="text-sm text-blue-600 font-semibold mb-2">
          {category}
        </div>
        <h2 className="text-base font-bold mb-3 line-clamp-3 leading-snug min-h-[4rem]">
          <Link 
            href={`/blog/${slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {title}
          </Link>
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
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
