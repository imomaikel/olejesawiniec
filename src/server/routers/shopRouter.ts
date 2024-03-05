import { loggedInProcedure, publicProcedure, router } from '../trpc';
import { getLandingPageProducts } from './cache';
import { TBasketVariant } from '@/lib/types';
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
        opinions: true,
        ratings: {
          select: { id: true },
        },
      },
    });

    //  TODO Calculate rating

    return product ?? null;
  }),
  getEnabledProducts: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const products = await prisma.product.findMany({
      where: {
        enabled: true,
        lowestPrice: {
          gte: 1,
        },
      },
      include: {
        variants: true,
        tags: true,
        category: true,
      },
    });
    return products ?? null;
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
        cart: z.custom<TBasketVariant[]>(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { cart } = input;

      const ids = cart.map(({ variant }) => variant.id);

      const variants = await prisma.variant.findMany({
        where: {
          id: {
            in: ids,
          },
        },
        include: {
          product: true,
        },
      });

      const updatedProducts: TBasketVariant[] = [];

      cart.forEach((item) => {
        const variant = variants.find((entry) => entry.id === item.variant.id);
        if (!variant) return;

        if (!variant.product?.enabled) return;

        // No stock
        if (variant.stock < item.quantity) {
          item.quantity = variant.stock;
        }

        // Price
        if (variant.price !== item.variant.price) {
          item.variant.price = variant.price;
        }

        updatedProducts.push(item);
      });

      return updatedProducts;
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

        return { success: data };
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
  getRandomProduct: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const products = await prisma.product.findMany({
      where: {
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
});

// TODO ZOD CUSTOM
