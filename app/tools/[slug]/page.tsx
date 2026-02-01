import { ALL_TOOLS } from '@/lib/constants';
import ToolComingSoonClient from './ToolComingSoonClient';

// Generate static params for all tools
export function generateStaticParams() {
  return ALL_TOOLS.map((tool) => ({
    slug: tool.href.split('/').pop() || '',
  }));
}

interface ToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = ALL_TOOLS.find(t => t.href === `/tools/${slug}`);
  
  // Get related tools (same category or next 3)
  const relatedTools = tool 
    ? ALL_TOOLS.filter(t => t.category === tool.category && t.href !== `/tools/${slug}`).slice(0, 3)
    : ALL_TOOLS.slice(0, 3);

  return <ToolComingSoonClient tool={tool} relatedTools={relatedTools} />;
}
