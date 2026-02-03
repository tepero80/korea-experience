import { PostMetadata } from '@/lib/posts';
import BlogCard from './BlogCard';

interface RelatedPostsProps {
  posts: PostMetadata[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-12 border-t border-gray-200">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Continue Reading
        </h2>
        <p className="text-gray-600">
          Explore more articles you might find interesting
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
