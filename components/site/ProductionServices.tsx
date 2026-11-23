'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import adConfig from '@/data/ad-config.json';
import { readAnalyticsPreference, setAnalyticsPageContext } from '@/lib/analytics';
import {
  ANALYTICS_ID,
  ANALYTICS_ORIGIN,
  ANALYTICS_READY_EVENT,
  publicAnalyticsPath,
} from '@/lib/analytics-policy';
export default function ProductionServices() {
  const path = usePathname();
  const navigation = useRef<{
    path: string | null;
    context: ReturnType<typeof setAnalyticsPageContext>;
    viewed: boolean;
  } | null>(null);
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
    const publicPath = publicAnalyticsPath(path);
    if (!navigation.current || navigation.current.path !== publicPath) {
      const previous = navigation.current;
      // An excluded route breaks the public path sequence without becoming a referrer.
      const referrer = previous
        ? previous.path
          ? ANALYTICS_ORIGIN + previous.path
          : ''
        : document.referrer;
      navigation.current = {
        path: publicPath,
        context: setAnalyticsPageContext(path, referrer),
        viewed: false,
      };
    }
    const visit = navigation.current;
    function sync() {
      const accepted = readAnalyticsPreference() === 'accepted';
      if (!accepted) {
        try {
          window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
        } catch {}
        return;
      }
      const context = visit.context;
      if (!context) return;
      try {
        window.dataLayer ||= [];
        // The Google tag consumes the arguments object queued by its standard snippet.
        window.gtag ||= function () {
          window.dataLayer!.push(arguments);
        };
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
        if (!visit.viewed) {
          window.gtag('event', 'page_view', { ...context, page_title: document.title });
          visit.viewed = true;
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
