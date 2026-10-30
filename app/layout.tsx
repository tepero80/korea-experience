import type { Metadata } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import './editorial.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConsentManager from '@/components/site/ConsentManager';
import ProductionServices from '@/components/site/ProductionServices';
import { SITE_CONFIG } from '@/lib/constants';
export const metadata: Metadata = {
  title: { default: SITE_CONFIG.title, template: '%s | Korea Experience' },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  authors: [{ name: SITE_CONFIG.author, url: `${SITE_CONFIG.url}/editorial-policy` }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: '/images/cards/korea-experience.jpg',
        width: 1200,
        height: 630,
        alt: 'Korea Experience — practical guides and useful travel tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: ['/images/cards/korea-experience.jpg'],
  },
  alternates: { types: { 'application/rss+xml': '/feed' } },
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
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial corrections',
      email: SITE_CONFIG.email,
    },
    publishingPrinciples: `${SITE_CONFIG.url}/editorial-policy`,
  };
  return (
    <html lang="en" data-scroll-behavior="smooth">
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
