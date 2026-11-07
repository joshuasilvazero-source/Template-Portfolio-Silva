import { site } from '@/content/site';
import { plans } from '@/content/maintenance';
import type { Faq } from '@/content/faq';

/** Renders schema.org structured data. No ratings or reviews — none exist yet. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type='application/ld+json'
      // JSON.stringify output with "<" escaped cannot break out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export function businessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${site.url}/#business`,
    name: site.businessName,
    description: site.description,
    url: site.url,
    email: site.email,
    image: `${site.url}/images/hero/profile.jpg`,
    priceRange: '$$',
    founder: {
      '@type': 'Person',
      name: site.name,
      jobTitle: 'Freelance Web Designer & Front-End Developer',
      sameAs: [site.social.linkedin, site.social.github],
    },
    areaServed: [
      { '@type': 'City', name: 'Colorado Springs, CO' },
      { '@type': 'City', name: 'Fountain, CO' },
      { '@type': 'State', name: 'Colorado' },
      { '@type': 'Country', name: 'United States' },
    ],
    address: { '@type': 'PostalAddress', addressLocality: 'Colorado Springs', addressRegion: 'CO', addressCountry: 'US' },
    knowsAbout: ['Web design', 'Front-end development', 'Responsive design', 'UI/UX design', 'Shopify', 'React'],
    makesOffer: plans.map(p => ({
      '@type': 'Offer',
      name: p.name,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: p.price,
        priceCurrency: 'USD',
        unitText: 'MONTH',
      },
    })),
  };
}

export function faqSchema(items: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${site.url}${it.path}` })),
  };
}
