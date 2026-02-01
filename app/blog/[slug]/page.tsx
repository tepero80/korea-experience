import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// This will be replaced with actual markdown loading in the next step
type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  
  return {
    title: `${slug.replace(/-/g, ' ')} - Korea Experience`,
    description: 'Read this comprehensive guide on Korea Experience.',
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  
  // TODO: Load actual markdown content
  // For now, showing a placeholder
  
  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <div className="text-sm text-blue-600 font-semibold mb-2">
          Medical Tourism
        </div>
        <h1 className="text-4xl font-bold mb-4">
          {slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </h1>
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          <time>February 1, 2026</time>
          <span>•</span>
          <span>10 min read</span>
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-8">
          This is a placeholder for the blog post content. In the next step, we'll implement 
          the markdown loading system to display actual content.
        </p>

        <h2>Coming Soon</h2>
        <p>
          The full content for this article will be available once we implement the markdown 
          content management system. Stay tuned!
        </p>
      </div>

      {/* Author Box - E-E-A-T */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">About the Author</h3>
        <p className="text-gray-600">
          Written by the Korea Experience editorial team - experts in Korean medical tourism, 
          travel, and culture with years of research and firsthand experience.
        </p>
      </div>

      {/* Medical Disclaimer */}
      <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400">
        <h4 className="font-semibold mb-2">Medical Disclaimer</h4>
        <p className="text-sm text-gray-700">
          This article is for informational purposes only and does not constitute medical advice. 
          Always consult qualified healthcare professionals before making medical decisions. 
          Read our full <a href="/disclaimer" className="text-blue-600 hover:underline">Medical Disclaimer</a>.
        </p>
      </div>
    </article>
  );
}
