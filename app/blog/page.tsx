import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - Korea Experience',
  description: 'Read our latest guides on medical tourism, travel, K-culture, and investment in Korea.',
};

export default function BlogPage() {
  // TODO: This will be populated with actual blog posts from markdown files
  const samplePosts = [
    {
      slug: 'best-rhinoplasty-clinics-gangnam-2026',
      title: 'Best Rhinoplasty Clinics in Gangnam 2026',
      excerpt: 'Discover the top-rated plastic surgery clinics in Gangnam for nose jobs, with detailed price comparisons and patient reviews.',
      category: 'Medical Tourism',
      date: '2026-02-01',
      image: '/images/blog/rhinoplasty-gangnam.jpg',
    },
    // More posts will be added here
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Korea Experience Blog</h1>
        <p className="text-xl text-gray-600">
          Expert guides and insights on medical tourism, travel, K-culture, and more.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Category Filter - Coming soon */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            All Posts
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
            Medical Tourism
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
            Travel Guide
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
            K-Culture
          </button>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {samplePosts.map((post) => (
            <article 
              key={post.slug}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-200">
                {/* Image will be added when we have actual images */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Image Coming Soon
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-sm text-blue-600 font-semibold mb-2">
                  {post.category}
                </div>
                <h2 className="text-xl font-bold mb-2 line-clamp-2">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State when no posts */}
        {samplePosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No blog posts yet. Check back soon for exciting content!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
