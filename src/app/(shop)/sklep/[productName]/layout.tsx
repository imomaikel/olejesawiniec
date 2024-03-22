'use server';
import { startCase } from 'lodash';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { productName: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { link: params.productName },
  });

  return {
    title: startCase(product?.label || 'Sklep'),
  };
}

const ProductPageLayout = async ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ProductPageLayout;
