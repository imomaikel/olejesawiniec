import { BasketVariantsSchema, OpinionSchema, RatingSchema } from '@/lib/validators/order';
import { loggedInProcedure, publicProcedure, router } from '../trpc';
import { OPINIONS_PER_PAGE, TSortOptions } from '@/utils/constans';
import { addReview, findProductsToReview } from '@/lib/reviews';
import { verifyUserCart } from '../payments/verify';
import { getLandingPageProducts } from './cache';
import { TRPCError } from '@trpc/server';
import { subDays } from 'date-fns';
import { z } from 'zod';

export const shopRouter = router({
  getProduct: publicProcedure.input(z.object({ productName: z.string() })).query(async ({ ctx, input }) => {
    const { productName } = input;
    const { prisma } = ctx;

    const now = new Date().getTime();
    const upTo30Days = 1000 * 60 * 60 * 24 * 30;
    const dateRange = new Date(now - upTo30Days);

    const product = await prisma.product.findFirst({
      where: { link: productName, enabled: true },
      include: {
        details: true,
        extraPhotos: true,
        nutritionFact: true,
        tags: true,
        variants: {
          include: {
            priceHistory: {
              take: 1,
              where: {
                createdAt: {
                  gte: dateRange,
                },
              },
              orderBy: {
                price: 'asc',
              },
            },
          },
        },
        opinions: {
          select: {
            showAvatar: true,
            content: true,
            id: true,
            createdAt: true,
            user: {
              select: {
                image: true,
                name: true,
                firstName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: OPINIONS_PER_PAGE,
        },
        _count: {
          select: {
            opinions: true,
          },
        },
        ratings: {
          select: { id: true },
        },
      },
    });

    if (product) {
      const fallbackDate = subDays(new Date(), 30);
      product.variants.forEach((variant, index) => {
        if (variant.priceHistory.length <= 0) {
          variant.priceHistory.push({
            createdAt: fallbackDate,
            id: BigInt(index - 100),
            price: variant.price,
            variantId: variant.id,
          });
        }
      });
      product.opinions = product.opinions.map((opinion) => {
        if (opinion.user) {
          if (!opinion.showAvatar) {
            opinion.user.image = null;
          }
          opinion.user.name = opinion.user.name?.split(' ')[0] || null;
          opinion.user.firstName = opinion.user.firstName?.split(' ')[0] || null;
        }
        return opinion;
      });
    }

    return product ?? null;
  }),
  getOpinions: publicProcedure.input(z.object({ page: z.number() })).mutation(async ({ ctx, input }) => {
    const { prisma } = ctx;
    const { page } = input;

    const opinions = (
      await prisma.opinion.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          showAvatar: true,
          content: true,
          id: true,
          createdAt: true,
          user: {
            select: {
              image: true,
              name: true,
              firstName: true,
            },
          },
        },
        take: OPINIONS_PER_PAGE,
        skip: OPINIONS_PER_PAGE * page,
      })
    ).map((opinion) => {
      if (opinion.user) {
        if (!opinion.showAvatar) {
          opinion.user.image = null;
        }
        opinion.user.name = opinion.user.name?.split(' ')[0] || null;
        opinion.user.firstName = opinion.user.firstName?.split(' ')[0] || null;
      }
      return opinion;
    });

    return opinions;
  }),
  getEnabledProducts: publicProcedure
    .input(
      z.object({
        orderBy: z.custom<TSortOptions>().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { orderBy } = input;
      const { prisma } = ctx;

      const products = await prisma.product.findMany({
        where: {
          enabled: true,
          lowestPrice: {
            gte: 1,
          },
        },
        select: {
          tags: true,
          category: true,
          label: true,
          mainPhoto: true,
          link: true,
          lowestPrice: true,
          highestPrice: true,
        },
        ...((!orderBy || orderBy === 'domyślnie') && {
          orderBy: {
            createdAt: 'asc',
          },
        }),
        ...(orderBy === 'alfabetycznie' && {
          orderBy: {
            label: 'asc',
          },
        }),
        ...(orderBy === 'cena_malejąco' && {
          orderBy: {
            lowestPrice: 'desc',
          },
        }),
        ...(orderBy === 'cena_rosnąco' && {
          orderBy: {
            lowestPrice: 'asc',
          },
        }),
        ...(orderBy === 'nowości' && {
          orderBy: {
            createdAt: 'desc',
          },
        }),
        ...(orderBy === 'ilość_opinii' && {
          orderBy: {
            opinions: {
              _count: 'desc',
            },
          },
        }),
        ...(orderBy === 'popularność' && {
          orderBy: {
            paymentProducts: {
              _count: 'desc',
            },
          },
        }),
        ...(orderBy === 'najlepiej_oceniane' && {
          orderBy: {
            rating: 'desc',
          },
        }),
      });

      if (!products) return null;

      const productList = products.map((product) => {
        const tags = product.tags.map((tag) => tag.label);
        return { ...product, tags };
      });

      return productList;
    }),
  verifyCartItem: publicProcedure
    .input(
      z.object({
        currentQuantity: z.number(),
        variantId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { currentQuantity, variantId } = input;
      const { prisma } = ctx;

      const variant = await prisma.variant.findFirst({
        where: { id: variantId },
      });

      if (!variant) return 'Nieprawidłowy produkt.';

      const newQuantity = currentQuantity + 1;

      if (newQuantity <= variant.stock) {
        return true;
      }
      return 'Brak danej pojemności na magazynie';
    }),
  verifyCart: publicProcedure
    .input(
      z.object({
        cart: BasketVariantsSchema,
      }),
    )
    .query(async ({ input }) => {
      const cart = await verifyUserCart(input.cart);
      return cart;
    }),
  addToWishList: loggedInProcedure
    .input(
      z.object({
        variantId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, user } = ctx;
      const { variantId } = input;

      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            wishList: {
              update: {
                variant: {
                  connect: {
                    id: variantId,
                  },
                },
              },
            },
          },
        });
        return { success: true };
      } catch (error) {
        return { error: true };
      }
    }),
  getWishList: loggedInProcedure
    .input(
      z.object({
        variantIds: z.string().array(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { variantIds } = input;
      const { prisma } = ctx;

      try {
        const data = await prisma.variant.findMany({
          where: {
            id: {
              in: variantIds,
            },
          },
          select: {
            product: {
              select: {
                label: true,
                link: true,
                mainPhoto: true,
              },
            },
            capacity: true,
            price: true,
            stock: true,
            unit: true,
            id: true,
          },
        });

        return { success: true, wishList: data };
      } catch {}
      return { error: true };
    }),
  removeFromWishList: loggedInProcedure
    .input(
      z.object({
        variantId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, user } = ctx;
      const { variantId } = input;

      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            wishList: {
              update: {
                variant: {
                  disconnect: {
                    id: variantId,
                  },
                },
              },
            },
          },
        });

        return { success: true };
      } catch {}

      return { error: true };
    }),
  getLandingPageProducts: publicProcedure.query(async ({ ctx }) => {
    const products = getLandingPageProducts();

    return products;
  }),
  getRandomProduct: publicProcedure
    .input(z.object({ previousId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { previousId } = input;
      const { prisma } = ctx;

      const products = await prisma.product.findMany({
        where: {
          ...(previousId && {
            id: {
              not: previousId,
            },
          }),
          enabled: true,
          details: {
            some: {
              id: {
                not: undefined,
              },
            },
          },
        },
        select: {
          label: true,
          link: true,
          details: true,
          tags: true,
          id: true,
        },
      });

      const randomProduct = products[Math.floor(Math.random() * products.length)];

      return randomProduct;
    }),
  getShippingConfig: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const config = await prisma.shopConfig.findFirst({
      select: {
        courierPrice: true,
        inpostFreeShippingOverPrice: true,
        inpostPrice: true,
      },
    });

    if (!config) {
      return { error: true, message: 'Nie udało się wczytać ustawień dostaw.' };
    }

    return { success: true, data: config };
  }),
  getMyOrders: loggedInProcedure.query(async ({ ctx }) => {
    const { prisma, user } = ctx;

    if (!user.email) throw new TRPCError({ code: 'UNAUTHORIZED' });

    try {
      const orders = await prisma.payment.findMany({
        where: {
          OR: [{ email: user.email }, { userId: user.id }],
        },
        select: {
          cashbillId: true,
          productsPrice: true,
          createdAt: true,
          status: true,
          totalProducts: true,
          updatedAt: true,
          shippingPrice: true,
        },
      });

      return orders;
    } catch {
      return [];
    }
  }),
  getProductsToReview: loggedInProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    if (!user.email) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const products = await findProductsToReview(user.id, user.email);

    return products;
  }),
  addOpinion: loggedInProcedure.input(OpinionSchema).mutation(async ({ ctx, input }) => {
    const { cashbillId, opinion, originalProductId, showAvatar } = input;
    const { user } = ctx;

    if (!user.email) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const action = await addReview({
      cashbillId,
      method: 'OPINION',
      opinion,
      originalProductId,
      userEmail: user.email,
      userId: user.id,
      showAvatar,
    });

    return action;
  }),
  addRating: loggedInProcedure.input(RatingSchema).mutation(async ({ ctx, input }) => {
    const { cashbillId, originalProductId, rating } = input;
    const { user } = ctx;

    if (!user.email) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const action = await addReview({
      cashbillId,
      method: 'RATING',
      originalProductId,
      rating,
      userEmail: user.email,
      userId: user.id,
    });

    return action;
  }),
  getCustomFeatures: loggedInProcedure.input(z.object({ variantId: z.string() })).query(async ({ ctx, input }) => {
    const { variantId } = input;
    const { prisma } = ctx;

    const variant = await prisma.variant.findUnique({
      where: { id: variantId },
      select: {
        product: {
          where: {
            enabled: true,
          },
          select: {
            label: true,
            customFeatures: true,
            category: {
              select: {
                customFeatures: true,
              },
            },
          },
        },
      },
    });

    const productFeatures = variant?.product?.customFeatures || [];
    const categoryFeatures = variant?.product?.category?.customFeatures || [];

    for (const feature of categoryFeatures) {
      if (!productFeatures.find((entry) => entry.id === feature.id)) {
        productFeatures.push(feature);
      }
    }

    return { features: productFeatures, productLabel: variant?.product?.label || null };
  }),
});
