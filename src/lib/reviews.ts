'use server';
import prisma from './prisma';
import { z } from 'zod';

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
                equals: 0,
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
          if (addedProducts.has(product.originalProductId) || (product.opinion === true && product.rating !== 0)) {
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

type TAddReview = {
  cashbillId: string;
  userId: string;
  userEmail: string;
  originalProductId: string;
} & (TAddReviewRating | TAddReviewOpinion);
type TAddReviewRating = {
  method: 'RATING';
  rating: number;
};
type TAddReviewOpinion = {
  method: 'OPINION';
  opinion: string;
  showAvatar: boolean;
};
export const addReview = async (props: TAddReview) => {
  const { cashbillId, method, userEmail, userId, originalProductId } = props;

  const availableReviews = await findProductsToReview(userId, userEmail);

  const safeOpinion = method === 'OPINION' ? z.string().min(4).max(512).safeParse(props.opinion).success : true;
  const safeRating = method === 'RATING' ? z.number().min(1).max(5).safeParse(props.rating).success : true;

  if (!safeOpinion || !safeRating) return { error: true, message: 'Nieprawidłowe dane.' };

  const payment = availableReviews.find((entry) => entry.cashbillId === cashbillId);
  const product = payment?.products.find((entry) => entry.originalProductId === originalProductId);
  const originalProduct = await prisma.product.findUnique({ where: { id: product?.originalProductId || '0' } });

  if (!payment || !product || !originalProduct) {
    return {
      error: true,
      message: `Aktualnie nie możesz dodać ${method === 'OPINION' ? 'opinii' : 'oceny'} do tego produktu.`,
    };
  }

  if (method === 'OPINION' && product.isOpinion) {
    return { error: true, message: 'Opinia do tego produktu została już dodana.' };
  }
  if (method === 'RATING' && product.isRating) {
    return { error: true, message: 'Ocena do tego produktu została już dodana.' };
  }

  if (method === 'OPINION') {
    try {
      await prisma.product.update({
        where: { id: originalProduct.id },
        data: {
          opinions: {
            create: {
              content: props.opinion,
              showAvatar: props.showAvatar,
              user: {
                connect: {
                  id: userId,
                },
              },
            },
          },
        },
      });
      await prisma.payment.update({
        where: { cashbillId },
        data: {
          products: {
            updateMany: {
              where: {
                originalProductId,
              },
              data: {
                opinion: true,
              },
            },
          },
        },
      });
      return { success: true, message: 'Dodano opinię.' };
    } catch {
      return { error: true, message: 'Nie udało się dodać opinii.' };
    }
  }

  if (method === 'RATING') {
    try {
      await prisma.product.update({
        where: { id: originalProduct.id },
        data: {
          ratings: {
            create: {
              score: props.rating,
            },
          },
        },
      });
      await prisma.payment.update({
        where: { cashbillId },
        data: {
          products: {
            updateMany: {
              where: {
                originalProductId,
              },
              data: {
                rating: props.rating,
              },
            },
          },
        },
      });
      updateRating(originalProductId);

      return { success: true, message: 'Dodano ocenę.' };
    } catch {
      return { error: true, message: 'Nie udało się dodać oceny.' };
    }
  }

  return { error: true };
};

const updateRating = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      ratings: true,
    },
  });
  if (!product) return;

  const ratings = product.ratings.length || 1;
  const totalScore = product.ratings.reduce((acc, curr) => (acc += curr.score), 0);
  const newRating = parseFloat((totalScore / ratings).toFixed(2));

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: newRating,
    },
  });
};
