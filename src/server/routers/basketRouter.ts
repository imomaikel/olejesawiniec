import { loggedInProcedure, router } from '../trpc';
import { TBasketVariant } from '@/lib/types';
import { z } from 'zod';

export const basketRouter = router({
  get: loggedInProcedure.query(async ({ ctx }) => {
    const { prisma, user } = ctx;

    const basketVariants: TBasketVariant[] =
      (
        await prisma.user.findUnique({
          where: {
            id: user.id,
          },
          select: {
            basket: {
              select: {
                variants: {
                  select: {
                    quantity: true,
                    variant: {
                      select: {
                        id: true,
                        capacity: true,
                        price: true,
                        unit: true,
                        product: {
                          select: {
                            link: true,
                            label: true,
                            mainPhoto: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        })
      )?.basket?.variants ?? [];

    return basketVariants;
  }),
  add: loggedInProcedure.input(z.object({ variantId: z.string() })).mutation(async ({ ctx, input }) => {
    const { prisma, user } = ctx;
    const { variantId } = input;

    try {
      const variant = await prisma.variant.findUnique({
        where: {
          id: variantId,
          stock: {
            gte: 1,
          },
          product: {
            enabled: true,
          },
        },
      });

      if (!variant) {
        return { error: true, message: 'Ten produkt aktualnie nie jest w sprzedaży.' };
      }

      const userBasket =
        (
          await prisma.user.findUnique({
            where: { id: user.id },
            select: {
              basket: {
                select: { variants: true },
              },
            },
          })
        )?.basket?.variants ?? [];

      const isAlredyInBasket = userBasket.find((entry) => entry.variantId === variant.id);
      const isInStock = (isAlredyInBasket?.quantity ?? 0) + 1 <= variant.stock;

      if (!isInStock) {
        return { error: true, message: 'Aktualnie nie ma możliwości zamówienia większej ilości tego produktu.' };
      }

      if (isAlredyInBasket) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            basket: {
              update: {
                variants: {
                  updateMany: {
                    where: {
                      variantId: variant.id,
                    },
                    data: {
                      quantity: {
                        increment: 1,
                      },
                    },
                  },
                },
              },
            },
          },
        });
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            basket: {
              update: {
                variants: {
                  create: {
                    variant: {
                      connect: {
                        id: variant.id,
                      },
                    },
                  },
                },
              },
            },
          },
        });
      }
      return { success: true, message: 'Dodano do koszyka!' };
    } catch (error) {
      console.log(error);
      return { error: true, message: 'Wystąpił błąd.' };
    }
  }),
  remove: loggedInProcedure.input(z.object({ variantId: z.string() })).mutation(async ({ ctx, input }) => {
    const { prisma, user } = ctx;
    const { variantId } = input;

    try {
      const updateBasket = await prisma.user.update({
        where: { id: user.id },
        data: {
          basket: {
            update: {
              variants: {
                updateMany: {
                  where: {
                    variantId,
                  },
                  data: {
                    quantity: {
                      decrement: 1,
                    },
                  },
                },
              },
            },
          },
        },
        select: {
          basket: {
            select: {
              variants: {
                where: {
                  variantId,
                },
              },
            },
          },
        },
      });

      const newQuantity = updateBasket.basket?.variants.find((entry) => entry.variantId === variantId)?.quantity;
      if (newQuantity === undefined) {
        return { error: true, message: 'Ten produkt nie jest w koszyku.' };
      }
      if (newQuantity === 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            basket: {
              delete: {
                variants: {
                  some: {
                    variantId,
                  },
                },
              },
            },
          },
        });
        return { success: true, message: 'Usunięto produkt z koszyka.' };
      }
      return { success: true, message: 'Usunięto jedną sztukę.' };
    } catch (error) {
      console.log(error);
      return { error: true, message: 'Wystąpił błąd.' };
    }
  }),
  setQuantity: loggedInProcedure
    .input(z.object({ variantId: z.string(), newQuantity: z.number().min(0) }))
    .mutation(async ({ ctx, input }) => {
      const { prisma, user } = ctx;
      const { newQuantity, variantId } = input;

      try {
        const [variant, userData] = await Promise.all([
          prisma.variant.findUnique({
            where: {
              id: variantId,
              stock: {
                gte: newQuantity,
              },
              product: {
                enabled: true,
              },
            },
          }),
          prisma.user.findUnique({
            where: { id: user.id },
            select: {
              basket: {
                select: { variants: true },
              },
            },
          }),
        ]);

        if (!variant) {
          return { error: true, message: 'Nie można dodać takiej ilości produktu do koszyka' };
        }
        const userBasket = userData?.basket?.variants ?? [];
        const isAlredyInBasket = userBasket.some((entry) => entry.variantId === variantId);

        if (newQuantity === 0) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              basket: {
                update: {
                  variants: {
                    deleteMany: { variantId },
                  },
                },
              },
            },
          });
          return { success: true, message: `Usunięto produkt z koszyka.` };
        }

        if (isAlredyInBasket) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              basket: {
                update: {
                  variants: {
                    updateMany: {
                      where: {
                        variantId: variant.id,
                      },
                      data: {
                        quantity: {
                          set: newQuantity,
                        },
                      },
                    },
                  },
                },
              },
            },
          });
        } else {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              basket: {
                update: {
                  variants: {
                    create: {
                      quantity: newQuantity,
                      variant: {
                        connect: {
                          id: variant.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          });
        }

        return { success: true, message: `Zmieniono ilośc na ${newQuantity}` };
      } catch (error) {
        console.log(error);
        return { error: true, message: 'Wystąpił błąd.' };
      }
    }),
});
