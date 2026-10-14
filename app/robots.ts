import type { MetadataRoute } from 'next';
import { getBrandConfig } from '@/lib/config/brand';

export default function robots(): MetadataRoute.Robots {
  const brand = getBrandConfig();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/account/', '/api/', '/checkout/', '/payment/'],
      },
    ],
    sitemap: `${brand.appUrl}/sitemap.xml`,
  };
}
