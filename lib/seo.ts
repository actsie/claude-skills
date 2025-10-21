import { Skill } from './types';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skills.pawgrammer.com';

/**
 * Generate JSON-LD structured data for the website
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Claude Skills Market',
    description: 'Make Claude your specialist. Discover and share modular Skills that extend Claude with real-world expertise.',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate JSON-LD structured data for an organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Claude Skills Market',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      // Add your social media URLs here
      // 'https://twitter.com/yourhandle',
      // 'https://github.com/yourorg',
    ],
  };
}

/**
 * Generate JSON-LD structured data for a skill article
 */
export function generateSkillArticleSchema(skill: Skill) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: skill.title,
    description: skill.description,
    author: {
      '@type': 'Person',
      name: skill.author || 'Claude Skills Market',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Claude Skills Market',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: skill.date,
    dateModified: skill.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/skills/${skill.slug}`,
    },
    keywords: [...(skill.tags || []), ...(skill.categories || [])].join(', '),
  };
}

/**
 * Generate JSON-LD structured data for a breadcrumb list
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

/**
 * Generate JSON-LD structured data for a software application
 */
export function generateSoftwareApplicationSchema(skill: Skill) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: skill.title,
    description: skill.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: skill.version ? {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    } : undefined,
  };
}

/**
 * Helper to inject JSON-LD into a page
 */
export function generateJsonLd(schema: Record<string, any> | Record<string, any>[]) {
  return {
    __html: JSON.stringify(schema),
  };
}
