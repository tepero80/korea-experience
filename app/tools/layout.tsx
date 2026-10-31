import { toolMetadata } from '@/lib/seo';
import { TOOLKIT_PREVIEW } from '@/lib/tool-preview';
export const metadata = toolMetadata(TOOLKIT_PREVIEW);

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
