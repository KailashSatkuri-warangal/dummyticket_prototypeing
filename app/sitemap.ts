import type { MetadataRoute } from 'next';
import { getBrandConfig } from '@/lib/config/brand';
import { BLOG_POSTS, DESTINATIONS, ROUTE_PAGES } from '@/lib/flights/dataset';

export default function sitemap(): MetadataRoute.Sitemap {
  const brand = getBrandConfig();
  const base = brand.appUrl;
  const now = new Date();

  const staticRoutes = [
    '',
    '/flights',
    '/track-booking',
    '/about',
    '/contact',
    '/help',
    '/faq',
    '/privacy-policy',
    '/terms-and-conditions',
    '/refund-policy',
    '/cancellation-policy',
    '/cookie-policy',
    '/disclaimer',
    '/blog',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  const blogUrls = BLOG_POSTS.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const destUrls = DESTINATIONS.map((d) => ({
    url: `${base}/destinations/${d.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const routeUrls = ROUTE_PAGES.map((r) => ({
    url: `${base}/routes/${r.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...routeUrls, ...destUrls, ...blogUrls];
}
