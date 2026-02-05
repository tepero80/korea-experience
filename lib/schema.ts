import { SITE_CONFIG } from '@/lib/constants';

interface ArticleSchemaProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  category: string;
  url: string;
  imageUrl?: string;
}

export function generateArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  author,
  category,
  url,
  imageUrl,
}: ArticleSchemaProps) {
  // Ensure ISO 8601 format for dates
  const publishDate = new Date(datePublished).toISOString();
  const modifiedDate = dateModified ? new Date(dateModified).toISOString() : publishDate;

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
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
    datePublished: publishDate,
    dateModified: modifiedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: category,
    inLanguage: 'en-US',
  };

  // Add image if provided
  if (imageUrl) {
    schema.image = {
      '@type': 'ImageObject',
      url: imageUrl,
    };
  }

  return schema;
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

// BreadcrumbList Schema
interface BreadcrumbItem {
  name: string;
  item: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

// FAQPage Schema
interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// HowTo Schema
interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  totalTime?: string;
  estimatedCost?: string;
  steps: HowToStep[];
}

export function generateHowToSchema({
  name,
  description,
  totalTime,
  estimatedCost,
  steps,
}: HowToSchemaProps) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: name,
    description: description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  };

  if (totalTime) schema.totalTime = totalTime;
  if (estimatedCost) schema.estimatedCost = estimatedCost;

  return schema;
}

// Review Schema
interface ReviewSchemaProps {
  itemReviewed: string;
  reviewBody: string;
  reviewRating: number;
  author: string;
  datePublished: string;
}

export function generateReviewSchema({
  itemReviewed,
  reviewBody,
  reviewRating,
  author,
  datePublished,
}: ReviewSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Thing',
      name: itemReviewed,
    },
    reviewBody: reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: reviewRating,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished: datePublished,
  };
}

// LocalBusiness Schema
interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  telephone?: string;
  priceRange?: string;
  image?: string;
  url: string;
}

export function generateLocalBusinessSchema({
  name,
  description,
  address,
  telephone,
  priceRange,
  image,
  url,
}: LocalBusinessSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: name,
    description: description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      ...(address.postalCode && { postalCode: address.postalCode }),
      addressCountry: address.addressCountry,
    },
    ...(telephone && { telephone: telephone }),
    ...(priceRange && { priceRange: priceRange }),
    ...(image && { image: image }),
    url: url,
  };
}
