import Link from 'next/link';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image?: string;
}

export default function BlogCard({ slug, title, excerpt, category, date, image }: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Image Coming Soon
          </div>
        )}
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
