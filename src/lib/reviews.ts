'use server';
import prisma from './prisma';

type TFindProductsToReviewReturn = {
  cashbillId: string;
  createdAt: Date;
  updatedAt: Date;
  products: {
    originalProductId: string;
    productName: string;
    isOpinion: boolean;
    isRating: boolean;
    variants: {
      price: number;
      capacity: number;
      quantity: number;
      unit: string;
    }[];
  }[];
}[];
export const findProductsToReview = async (userId: string, userEmail: string): Promise<TFindProductsToReviewReturn> => {
  const payments = await prisma.payment.findMany({
    where: {
      OR: [{ userId }, { email: userEmail }],
      status: 'Order_finished',
      products: {
        some: {
          OR: [
            {
              opinion: {
                not: true,
              },
            },
            {
              rating: {
                not: 0,
              },
            },
          ],
          originalProduct: {
            isNot: null,
          },
          originalProductId: {
            not: null,
          },
        },
      },
    },
    include: {
      products: {
        include: {
          originalProduct: true,
        },
      },
    },
  });

  if (!payments || !payments.length) return [];

  const data: TFindProductsToReviewReturn = [];

  for (const { cashbillId, createdAt, updatedAt, products } of payments) {
    const addedProducts = new Set();
    data.push({
      cashbillId,
      createdAt: createdAt,
      updatedAt: updatedAt,
      products: products
        .map((product) => {
          if (addedProducts.has(product.originalProductId)) {
            return { productName: 'null', variants: [], isOpinion: false, isRating: false, originalProductId: 'null' };
          }
          if (product.originalProductId) {
            addedProducts.add(product.originalProductId);
          }
          const productVariants = products.filter((entry) => entry.originalProductId === product.originalProductId);
          const variants: TFindProductsToReviewReturn[0]['products'][0]['variants'] = productVariants.map(
            (variant) => ({
              capacity: variant.productCapacity,
              price: variant.productPrice,
              quantity: variant.productQuantity,
              unit: variant.productUnit,
            }),
          );
          return {
            originalProductId: product.originalProductId || '',
            productName: product.productName,
            isOpinion: product.opinion,
            isRating: product.rating !== 0,
            variants,
          };
        })
        .filter(({ originalProductId }) => originalProductId !== 'null'),
    });
  }

  return data;
};
