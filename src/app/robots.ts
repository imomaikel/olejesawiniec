import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_PRODUCTION_URL;

const robots = (): MetadataRoute.Robots => {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/panel', '/zamowienie'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
};

export default robots;
