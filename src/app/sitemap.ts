import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

const SITE_URL = process.env.NEXT_PUBLIC_PRODUCTION_URL;

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const products = await prisma.product.findMany({ where: { enabled: true } });

  const productsList: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/sklep/${product.link}`,
    lastModified: product.updatedAt,
    priority: 0.8,
  }));

  return [
    { url: `${SITE_URL}/logowanie`, priority: 1 },
    { url: `${SITE_URL}/polityka-prywatnosci`, priority: 0.5 },
    { url: `${SITE_URL}/regulamin`, priority: 0.5 },
    ...productsList,
  ];
};

export default sitemap;
