import { ALL_TOOLS } from '@/lib/constants';
import ToolComingSoonClient from './ToolComingSoonClient';

// Generate static params for all tools
export function generateStaticParams() {
  return ALL_TOOLS.map((tool) => ({
    slug: tool.href.split('/').pop() || '',
  }));
}

interface ToolPageProps {
  params: {
    slug: string;
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = ALL_TOOLS.find(t => t.href === `/tools/${params.slug}`);
  
  // Get related tools (same category or next 3)
  const relatedTools = tool 
    ? ALL_TOOLS.filter(t => t.category === tool.category && t.href !== `/tools/${params.slug}`).slice(0, 3)
    : ALL_TOOLS.slice(0, 3);

  return <ToolComingSoonClient tool={tool} relatedTools={relatedTools} />;
}
