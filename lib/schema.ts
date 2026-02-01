import { SITE_CONFIG } from '@/lib/constants';

interface ArticleSchemaProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  category: string;
  url: string;
}

export function generateArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  author,
  category,
  url,
}: ArticleSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    author: {
      '@type': 'Organization',
      name: author || SITE_CONFIG.author,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: category,
    inLanguage: 'en-US',
  };
}

interface WebsiteSchemaProps {
  name: string;
  url: string;
  description: string;
}

export function generateWebsiteSchema({
  name,
  url,
  description,
}: WebsiteSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: name,
    url: url,
    description: description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

interface OrganizationSchemaProps {
  name: string;
  url: string;
  description: string;
  email: string;
  social: {
    twitter: string;
    facebook: string;
    instagram: string;
  };
}

export function generateOrganizationSchema({
  name,
  url,
  description,
  email,
  social,
}: OrganizationSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: name,
    url: url,
    description: description,
    email: email,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: email,
    },
    sameAs: [
      `https://twitter.com/${social.twitter.replace('@', '')}`,
      `https://facebook.com/${social.facebook}`,
      `https://instagram.com/${social.instagram}`,
    ],
  };
}
