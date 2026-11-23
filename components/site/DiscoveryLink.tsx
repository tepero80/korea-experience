'use client';

import { track } from '@/lib/analytics';
import type { DiscoveryEvent } from '@/lib/analytics-policy';

export default function DiscoveryLink({
  href,
  event,
  className,
  children,
}: {
  href: string;
  event: DiscoveryEvent;
  className?: string;
  children: React.ReactNode;
}) {
  // Keep both sides of a fragment journey in native browser history.
  return (
    <a href={href} className={className} onClick={() => track(event)}>
      {children}
    </a>
  );
}
