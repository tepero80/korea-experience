import { toolMetadata } from '@/lib/seo';
import { toolPreviewFor } from '@/lib/tool-preview';
export const metadata = toolMetadata(toolPreviewFor('trip-budget')!);
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
