'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import adConfig from '@/data/ad-config.json';
import { readAnalyticsPreference, setAnalyticsPageContext } from '@/lib/analytics';
import { ANALYTICS_ID, ANALYTICS_ORIGIN, ANALYTICS_READY_EVENT } from '@/lib/analytics-policy';
export default function ProductionServices() {
  const path = usePathname();
  const lastPage = useRef<{ path: string; referrer: string } | null>(null);
  useEffect(() => {
    if (location.origin !== ANALYTICS_ORIGIN) return;
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
      const accepted = readAnalyticsPreference() === 'accepted';
      if (!accepted) {
        try {
          window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
        } catch {}
        return;
      }
      const referrer =
        lastPage.current?.path === path
          ? lastPage.current.referrer
          : lastPage.current
            ? ANALYTICS_ORIGIN + lastPage.current.path
            : document.referrer;
      const context = setAnalyticsPageContext(path, referrer);
      if (!context) return;
      try {
        window.dataLayer ||= [];
        window.gtag ||= (...args: unknown[]) => window.dataLayer!.push(args);
        const firstLoad = !document.getElementById('ke-ga');
        if (firstLoad)
          window.gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
          });
        // Set defaults before loading GA so automatic events cannot inherit a
        // private query/hash or a sign-in callback referrer.
        window.gtag('set', context);
        window.gtag('consent', 'update', { analytics_storage: 'granted' });
        if (firstLoad) {
          const script = document.createElement('script');
          script.id = 'ke-ga';
          script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ANALYTICS_ID;
          script.async = true;
          document.head.append(script);
          window.gtag('js', new Date());
          window.gtag('config', ANALYTICS_ID, {
            ...context,
            send_page_view: false,
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
          });
        }
        if (lastPage.current?.path !== path) {
          window.gtag('event', 'page_view', { ...context, page_title: document.title });
          lastPage.current = { path, referrer: context.page_referrer };
        }
        window.dispatchEvent(new Event(ANALYTICS_READY_EVENT));
      } catch {
        /* Analytics failure cannot block the traveler task. */
      }
    }
    sync();
    window.addEventListener('ke-consent-change', sync);
    return () => window.removeEventListener('ke-consent-change', sync);
  }, [path]);
  return null;
}
