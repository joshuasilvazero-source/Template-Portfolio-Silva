import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { caseStudies } from '@/content/work';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: '', priority: 1 },
    { path: '/services', priority: 0.9 },
    { path: '/maintenance', priority: 0.9 },
    { path: '/pricing', priority: 0.9 },
    { path: '/work', priority: 0.8 },
    { path: '/contact', priority: 0.8 },
    { path: '/about', priority: 0.7 },
    { path: '/faq', priority: 0.6 },
    { path: '/privacy', priority: 0.2 },
    { path: '/terms', priority: 0.2 },
  ];
  return [
    ...pages.map(p => ({ url: `${site.url}${p.path}`, changeFrequency: 'monthly' as const, priority: p.priority })),
    ...caseStudies.map(c => ({ url: `${site.url}/work/${c.slug}`, changeFrequency: 'yearly' as const, priority: 0.6 })),
  ];
}
