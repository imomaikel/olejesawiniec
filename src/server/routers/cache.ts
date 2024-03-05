'use server';
import { minutesToMilliseconds } from 'date-fns';
import prisma from '../../lib/prisma';

let landingPageProductsLastUpdate: number | undefined = undefined;
let landingPageProductsData: TLandingPageProducts | undefined = undefined;

export const getLandingPageProducts = async (): Promise<TLandingPageProducts> => {
  if (!landingPageProductsData) {
    await _getLandingPageProducts();
  } else {
    const now = new Date().getTime();
    if (!landingPageProductsLastUpdate || now > landingPageProductsLastUpdate) {
      _getLandingPageProducts();
    }
  }

  return landingPageProductsData || [];
};
const _getLandingPageProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      enabled: true,
      mainPhoto: {
        not: null,
      },
      lowestPrice: {
        not: null,
      },
      category: {
        AND: [
          {
            label: {
              contains: 'olej',
            },
          },
          {
            label: {
              contains: 'zimno',
            },
          },
        ],
      },
      details: {
        some: {
          id: {
            not: undefined,
          },
        },
      },
    },
    select: {
      lowestPrice: true,
      label: true,
      mainPhoto: true,
      link: true,
      details: true,
      variants: true,
    },
    orderBy: {
      paymentProducts: {
        _count: 'desc',
      },
    },
    take: 10,
  });

  landingPageProductsData = products;
  landingPageProductsLastUpdate = new Date().getTime() + minutesToMilliseconds(10);
  return products;
};
export type TLandingPageProducts = Awaited<ReturnType<typeof _getLandingPageProducts>>;
