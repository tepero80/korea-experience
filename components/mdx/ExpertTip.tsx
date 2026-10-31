import type { ReactNode } from 'react';
interface ArchiveAttributionProps {
  name?: string;
  author?: string;
  role?: string;
  avatar?: string;
  children?: ReactNode;
  quote?: string;
  type?: string;
  verified?: boolean;
  experience?: string;
  location?: string;
}
// Legacy attributions have no independently reviewed evidence record.
// A JSX verified flag does not establish a real expert or interview.
// Keep the source recoverable in Git; withhold attribution and quotation.
// New interviews require a separately reviewed source/permission model.
export default function ExpertTip(_props: ArchiveAttributionProps) {
  return null;
}
