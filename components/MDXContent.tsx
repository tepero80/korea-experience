import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { TourCard } from './affiliate/TourCard';
import ImageGallery from './mdx/ImageGallery';
import PriceComparisonChart from './mdx/PriceComparisonChart';
import Timeline from './mdx/Timeline';
import InteractiveMap from './mdx/InteractiveMap';
import BeforeAfter from './mdx/BeforeAfter';
import ComparisonTable from './mdx/ComparisonTable';

// Custom components for MDX
const components = {
  // Headings with anchor links
  h1: (props: any) => (
    <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8" {...props} />
  ),
  h2: (props: any) => (
    <h2 
      id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
      className="text-3xl font-bold text-gray-900 mb-4 mt-10 pb-2 border-b-2 border-gray-200" 
      {...props} 
    />
  ),
  h3: (props: any) => (
    <h3 
      id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
      className="text-2xl font-semibold text-gray-900 mb-3 mt-8" 
      {...props} 
    />
  ),
  h4: (props: any) => (
    <h4 className="text-xl font-semibold text-gray-900 mb-2 mt-6" {...props} />
  ),
  
  // Paragraphs
  p: (props: any) => (
    <p className="text-xl text-gray-700 mb-6 leading-relaxed" {...props} />
  ),
  
  // Links with styling
  a: ({ href, children, ...props }: any) => {
    const isExternal = href?.startsWith('http');
    return (
      <Link 
        href={href || '#'}
        className="text-blue-600 hover:text-blue-700 underline underline-offset-2 font-medium transition-colors"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </Link>
    );
  },
  
  // Lists
  ul: (props: any) => (
    <ul className="list-disc list-inside mb-6 space-y-2 ml-4" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-inside mb-6 space-y-2 ml-4" {...props} />
  ),
  li: (props: any) => (
    <li className="text-xl text-gray-700" {...props} />
  ),
  
  // Blockquotes
  blockquote: (props: any) => (
    <blockquote 
      className="border-l-4 border-blue-500 pl-6 py-2 my-6 italic text-gray-600 bg-blue-50 rounded-r-lg" 
      {...props} 
    />
  ),
  
  // Code blocks
  code: (props: any) => {
    const { className, children } = props;
    const isInline = !className;
    
    if (isInline) {
      return (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800" {...props} />
      );
    }
    
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  
  pre: (props: any) => (
    <pre className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto mb-6 text-sm" {...props} />
  ),
  
  // Images
  img: ({ src, alt, ...props }: any) => (
    <div className="my-8">
      <img 
        src={src} 
        alt={alt || ''} 
        className="rounded-lg shadow-lg w-full h-auto"
        {...props} 
      />
      {alt && (
        <p className="text-sm text-gray-500 text-center mt-2 italic">{alt}</p>
      )}
    </div>
  ),
  
  // Horizontal rule
  hr: (props: any) => (
    <hr className="my-8 border-t-2 border-gray-200" {...props} />
  ),
  
  // Strong/Bold
  strong: (props: any) => (
    <strong className="font-semibold text-gray-900" {...props} />
  ),
  
  // Emphasis/Italic
  em: (props: any) => (
    <em className="italic" {...props} />
  ),

  // Tables - Complete styling
  table: (props: any) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden border-2 border-gray-300" {...props} />
    </div>
  ),
  
  thead: (props: any) => (
    <thead className="bg-gradient-to-r from-blue-800 to-blue-600" {...props} />
  ),
  
  th: (props: any) => (
    <th className="text-white font-bold px-6 py-4 text-left text-sm uppercase tracking-wide" {...props} />
  ),
  
  td: (props: any) => (
    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-200" {...props} />
  ),
  
  tr: (props: any) => (
    <tr className="even:bg-gray-50 hover:bg-blue-50 transition-colors" {...props} />
  ),

  // Affiliate Components
  TourCard: TourCard,
  
  // MDX Visual Components
  ImageGallery: ImageGallery,
  PriceComparisonChart: PriceComparisonChart,
  Timeline: Timeline,
  InteractiveMap: InteractiveMap,
  BeforeAfter: BeforeAfter,
  ComparisonTable: ComparisonTable,
};

interface MDXContentProps {
  source: string;
}

export default async function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote 
        source={source} 
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeHighlight,
              rehypeSlug,
            ],
          },
        }}
      />
    </div>
  );
}
