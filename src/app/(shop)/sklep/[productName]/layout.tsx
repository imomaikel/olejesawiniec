'use server';
import { startCase } from 'lodash';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import { cache } from 'react';

const getProduct = cache(async (productName: string) => {
  const product = await prisma.product.findUnique({
    where: { link: productName },
  });
  return product;
});

export async function generateMetadata({ params }: { params: { productName: string } }): Promise<Metadata> {
  const product = await getProduct(params.productName);
  let description = '';

  if (product?.description) {
    try {
      const data = JSON.parse(product.description);
      const text = data.blocks.map((block: any) => block.text.replace(/[0-9][,.][0-9]/g, '').replace(/[0-9]./g, '.'));
      for (const line of text) {
        if (description.length > 500) break;
        description += `${line}\n`;
      }
    } catch {}
  }

  let mainPhoto = '';
  if (product?.mainPhoto?.startsWith('/')) {
    mainPhoto = `${process.env.NEXT_PUBLIC_PRODUCTION_URL}${product.mainPhoto}`;
  } else if (product?.mainPhoto) {
    mainPhoto = product.mainPhoto;
  }

  return {
    title: startCase(product?.label || 'Sklep'),
    description,
    ...(product?.mainPhoto && {
      openGraph: {
        images: {
          url: product.mainPhoto,
        },
      },
    }),
  };
}

const ProductPageLayout = async ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ProductPageLayout;
