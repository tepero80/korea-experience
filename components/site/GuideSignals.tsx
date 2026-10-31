'use client';
import { useEffect } from 'react';
import { readAnalyticsPreference, track } from '@/lib/analytics';
export default function GuideSignals({ id, category }: { id: string; category: string }) {
  useEffect(() => {
    let visibleSeconds = 0,
      deep = false,
      sent = false;
    const tick = setInterval(() => {
      if (readAnalyticsPreference() !== 'accepted') {
        visibleSeconds = 0;
        return;
      }
      if (document.visibilityState === 'visible') visibleSeconds += 1;
      if (!sent && deep && visibleSeconds >= 45) {
        sent = track('guide_engaged', { content_id: id, category });
      }
    }, 1000);
    const onScroll = () => {
      const article = document.querySelector('.article-body');
      if (article) {
        const r = article.getBoundingClientRect();
        deep = r.top + r.height * 0.5 < innerHeight;
      }
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearInterval(tick);
      removeEventListener('scroll', onScroll);
    };
  }, [id, category]);
  return null;
}
