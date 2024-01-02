import { TCartItem } from '@/hooks/use-cart';
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';

export const shopRouter = router({
  getProduct: publicProcedure.input(z.object({ productName: z.string() })).query(async ({ ctx, input }) => {
    const { productName } = input;
    const { prisma } = ctx;

    const product = await prisma.product.findFirst({
      where: { link: productName, enabled: true },
      include: {
        details: true,
        extraPhotos: true,
        nutritionFact: true,
        tags: true,
        variants: true,
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
      where: { enabled: true },
      include: {
        variants: true,
        tags: true,
        Category: true,
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
        cart: z.custom<TCartItem[]>(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { cart } = input;

      const ids = cart.map(({ variantId }) => variantId);

      const variants = await prisma.variant.findMany({
        where: {
          id: {
            in: ids,
          },
        },
        include: {
          Product: true,
        },
      });

      const updatedProducts: TCartItem[] = [];

      cart.forEach((item) => {
        const variant = variants.find((entry) => entry.id === item.variantId);
        if (!variant) return;

        if (!variant.Product?.enabled) return;

        // No stock
        if (variant.stock < item.quantity) {
          item.quantity = variant.stock;
        }

        // Price
        if (variant.price !== item.variantPrice) {
          item.variantPrice = variant.price;
        }

        updatedProducts.push(item);
      });

      return updatedProducts;
    }),
});
