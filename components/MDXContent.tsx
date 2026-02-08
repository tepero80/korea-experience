import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { TourCard } from './affiliate/TourCard';

// Original MDX Components
import ImageGallery from './mdx/ImageGallery';
import PriceComparisonChart from './mdx/PriceComparisonChart';
import Timeline from './mdx/Timeline';
import InteractiveMap from './mdx/InteractiveMap';
import BeforeAfter from './mdx/BeforeAfter';
import ComparisonTable from './mdx/ComparisonTable';
import ResponsiveTable from './mdx/ResponsiveTable';

// New GEO-Optimized MDX Components (Deep Research Strategy)
import KeyTakeaways from './mdx/KeyTakeaways';
import InfoBox from './mdx/InfoBox';
import QuickFacts from './mdx/QuickFacts';
import StepGuide from './mdx/StepGuide';
import PriceTable from './mdx/PriceTable';
import LocationCard from './mdx/LocationCard';
import ProsCons from './mdx/ProsCons';
import DualismRoute from './mdx/DualismRoute';
import StatCard from './mdx/StatCard';
import ExpertTip from './mdx/ExpertTip';
import FAQAccordion from './mdx/FAQAccordion';

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
        className="text-amber-700 hover:text-amber-800 underline underline-offset-2 font-medium transition-colors"
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
      className="border-l-4 border-amber-400 pl-6 py-2 my-6 italic text-gray-600 bg-amber-50 rounded-r-lg" 
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
    <ResponsiveTable {...props} />
  ),
  
  thead: (props: any) => (
    <thead className="bg-gradient-to-r from-stone-700 via-stone-800 to-stone-700 [&_tr]:!bg-transparent [&_tr:hover]:!bg-transparent" {...props} />
  ),
  
  th: (props: any) => (
    <th className="text-white font-bold px-6 py-3 text-left text-sm md:text-lg uppercase tracking-wide" style={{ color: 'white' }} {...props} />
  ),
  
  td: (props: any) => (
    <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-200" {...props} />
  ),
  
  tr: (props: any) => (
    <tr className="even:bg-gray-50 hover:bg-amber-50 transition-colors" {...props} />
  ),

  // Affiliate Components
  TourCard: TourCard,
  
  // MDX Visual Components (Original)
  ImageGallery: ImageGallery,
  PriceComparisonChart: PriceComparisonChart,
  Timeline: Timeline,
  InteractiveMap: InteractiveMap,
  BeforeAfter: BeforeAfter,
  ComparisonTable: ComparisonTable,
  
  // GEO-Optimized Components (Deep Research Strategy)
  // 1. KeyTakeaways - AI 인용 최적화 (40단어 핵심 요약)
  KeyTakeaways: KeyTakeaways,
  // 2. InfoBox - 팁/경고/성공/정보/ARC-Free 박스
  InfoBox: InfoBox,
  // 3. QuickFacts - 팩트 밀도 강화 (수치 기반 요약)
  QuickFacts: QuickFacts,
  // 4. StepGuide - HowTo 스키마 연동 단계별 가이드
  StepGuide: StepGuide,
  // 5. PriceTable - 럭셔리 vs 실속 가격 비교 (이원성)
  PriceTable: PriceTable,
  // 6. LocationCard - LocalBusiness 스키마 연동
  LocationCard: LocationCard,
  // 7. ProsCons - 장단점 시각화
  ProsCons: ProsCons,
  // 8. DualismRoute - 이원적 가치 경로 (고급 vs 실속)
  DualismRoute: DualismRoute,
  // 9. StatCard - 통계/수치 하이라이트
  StatCard: StatCard,
  // 10. ExpertTip - E-E-A-T 강화 (전문가/현지인 팁)
  ExpertTip: ExpertTip,
  // 11. FAQAccordion - FAQPage 스키마 연동
  FAQAccordion: FAQAccordion,
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
