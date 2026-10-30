'use client';
import Link from 'next/link';
import { track } from '@/lib/analytics';
export default function TrackedLink({
  href,
  from,
  to,
  relation,
  children,
}: {
  href: string;
  from: string;
  to: string;
  relation: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={() => track('related_guide_click', { content_id: from, target_id: to, relation })}
    >
      {children}
    </Link>
  );
}
