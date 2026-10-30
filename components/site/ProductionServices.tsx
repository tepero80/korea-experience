'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import adConfig from '@/data/ad-config.json';
export default function ProductionServices() {
  const path = usePathname();
  useEffect(() => {
    if (location.hostname !== 'koreaexperience.com') return;
    // AdSense's own certified message handles advertising consent; the analytics banner does not.
    const article = /^\/blog\/(?!category(?:\/|$)|page(?:\/|$))[^/]+\/?$/.test(path);
    if (
      (article || path === '/privacy') &&
      adConfig.enabled &&
      adConfig.cmpVerified &&
      !document.getElementById('ke-adsense')
    ) {
      const ads = document.createElement('script');
      ads.id = 'ke-adsense';
      ads.async = true;
      ads.crossOrigin = 'anonymous';
      ads.src =
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
        adConfig.publisher;
      document.head.append(ads);
    }
    function sync() {
      const accepted = localStorage.getItem('ke-consent-v1') === 'accepted';
      if (!accepted) {
        window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
        return;
      }
      window.dataLayer ||= [];
      window.gtag ||= (...args: unknown[]) => window.dataLayer!.push(args);
      window.gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      if (!document.getElementById('ke-ga')) {
        const script = document.createElement('script');
        script.id = 'ke-ga';
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-8D8HNVWDR9';
        script.async = true;
        document.head.append(script);
        window.gtag('js', new Date());
        window.gtag('config', 'G-8D8HNVWDR9', { send_page_view: false });
      }
      window.gtag('event', 'page_view', {
        page_path: path,
        page_location: `https://koreaexperience.com${path}`,
        page_title: document.title,
      });
    }
    sync();
    window.addEventListener('ke-consent-change', sync);
    return () => window.removeEventListener('ke-consent-change', sync);
  }, [path]);
  return null;
}
