import type { Metadata } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import './editorial.css';
import './experience.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConsentManager from '@/components/site/ConsentManager';
import ProductionServices from '@/components/site/ProductionServices';
import { GUIDE_FEED_TYPES, SITE_CONFIG } from '@/lib/constants';
import { HOME_FEATURE } from '@/lib/home-feature';
export const metadata: Metadata = {
  title: { default: SITE_CONFIG.title, template: '%s | Korea Experience' },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  authors: [{ name: SITE_CONFIG.author, url: `${SITE_CONFIG.url}/editorial-policy` }],
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon', sizes: '16x16 32x32 48x48 96x96' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_CONFIG.name,
    url: SITE_CONFIG.url + '/',
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: '/images/cards/korea-experience.jpg',
        width: 1200,
        height: 630,
        alt: `Korea Experience travel guides, featuring ${HOME_FEATURE.place}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: ['/images/cards/korea-experience.jpg'],
  },
  alternates: { types: GUIDE_FEED_TYPES },
  verification: {
    other: { 'naver-site-verification': '752414d46da5987d29ae23c93b4665e604a39109' },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url + '/',
    description: SITE_CONFIG.description,
    logo: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial corrections',
      email: SITE_CONFIG.email,
    },
    publishingPrinciples: `${SITE_CONFIG.url}/editorial-policy`,
  };
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link
          rel="preload"
          href="/fonts/source-sans-3-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/manrope-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organization).replace(/</g, '\\u003c'),
          }}
        />
        <Header />
        <main id="main-content" className="site-main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <ConsentManager />
        <ProductionServices />
      </body>
    </html>
  );
}
