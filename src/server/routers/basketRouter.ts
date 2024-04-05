import { OrderDetailsSchema, TBasketVariantsSchema } from '@/lib/validators/order';
import { getPaymentMode } from '@/utils/paymentMode';
import { loggedInProcedure, router } from '../trpc';
import { calculateShipping } from '@/lib/shipping';
import { createNewTransaction } from '../payments';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const basketRouter = router({
  get: loggedInProcedure.query(async ({ ctx }) => {
    const { prisma, user } = ctx;

    const basketVariants: TBasketVariantsSchema =
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
              update: {
                variants: {
                  deleteMany: {
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
  pay: loggedInProcedure
    .input(
      z.object({
        personalDetails: OrderDetailsSchema,
        shippingMethod: z.enum(['INPOST', 'COURIER']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, user } = ctx;
      const { personalDetails, shippingMethod } = input;

      try {
        const userData = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            basket: {
              include: {
                variants: {
                  include: {
                    variant: {
                      include: {
                        product: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        const basket = userData?.basket;

        if (!basket) {
          return { error: true, message: 'Nie znaleziono koszyka.' };
        }

        const products =
          basket?.variants
            .filter((item) => {
              if (item.variant.product?.enabled) return true;
              return false;
            })
            .map((item) => {
              if (item.variant.stock < item.quantity) {
                return { ...item, quantity: item.variant.stock };
              }
              return item;
            }) ?? [];
        if (products.length <= 0) {
          return { error: true, message: 'Koszyk jest pusty' };
        }

        const totalPrice = products.reduce(
          (acc, curr) => (acc += curr.variant.product?.enabled ? curr.quantity * curr.variant.price : 0),
          0,
        );

        if (totalPrice < 1) {
          return { error: true, message: 'Wystąpił błąd (1)' };
        }

        let description = '';
        let totalProducts = 0;
        for (const item of products) {
          if (!item.variant.product?.enabled) return;
          totalProducts += item.quantity;
          description += `${item.quantity}x ${item.variant.product.label}(${item.variant.capacity}${item.variant.unit}) • `;
        }
        description += 'Dziękujemy za zakupy w naszym sklepie!';

        const paymentLink = await prisma.paymentLink.create({
          data: {},
        });

        const { email, phone, firstName, surname, courierData, inpostData, method } = personalDetails;

        const shippingPrice = await calculateShipping({
          method,
          productsTotalPrice: totalPrice,
        });
        if (shippingPrice === 'error') {
          return { error: true, message: 'Wystąpił błąd (cena dostawy)' };
        }

        const createTransaction = await createNewTransaction(
          {
            title: 'Olejesawiniec.pl - Zamówienie',
            negativeReturnUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/zamowienie/anulowane?id=${paymentLink.id}`,
            returnUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/zamowienie/link/${paymentLink.id}`,

            amount: {
              currencyCode: 'PLN',
              value: shippingMethod === 'COURIER' ? shippingPrice : totalPrice + shippingPrice,
            },
            description,
            personalData: {
              ...personalDetails,
            },
            languageCode: 'PL',
          },
          getPaymentMode(),
        );

        if (createTransaction.statusCode === 200) {
          const payment = await prisma.payment.create({
            data: {
              firstName,
              surname,
              phone,
              email,
              cashbillId: createTransaction.id,
              checkoutUrl: createTransaction.redirectUrl,
              status: 'PreStart',
              productsPrice: totalPrice,
              shipping: {
                create: {
                  method: shippingMethod,
                  ...(method === 'COURIER' && {
                    courierBuilding: courierData?.building,
                    courierCity: courierData?.city,
                    courierFlat: courierData?.flat,
                    courierPostCode: courierData?.postCode,
                    courierProvince: courierData?.province,
                    courierStreet: courierData?.street,
                  }),
                  ...(method === 'INPOST' && {
                    inpostBuildingNumber: inpostData?.buildingNumber,
                    inpostCity: inpostData?.city,
                    inpostFlatNumber: inpostData?.flatNumber,
                    inpostName: inpostData?.name,
                    inpostPostCode: inpostData?.postCode,
                    inpostProvince: inpostData?.province,
                    inpostStreet: inpostData?.street,
                  }),
                },
              },
              shippingPrice,
              totalProducts,
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          });
          await prisma.paymentLink.update({
            where: { id: paymentLink.id },
            data: {
              cashbillId: createTransaction.id,
              checkoutUrl: createTransaction.redirectUrl,
            },
          });
          for await (const item of products) {
            await prisma.payment.update({
              where: { id: payment.id },
              data: {
                products: {
                  create: {
                    productCapacity: item.variant.capacity,
                    productName: item.variant.product?.label ?? 'Produkt',
                    productPrice: item.variant.price,
                    productQuantity: item.quantity,
                    productUnit: item.variant.unit,
                    variantId: item.variant.id,
                    ...(item.variant.productId && {
                      originalProduct: {
                        connect: {
                          id: item.variant.productId,
                        },
                      },
                    }),
                  },
                },
              },
            });
          }
          return { success: true, redirectUrl: createTransaction.redirectUrl };
        } else {
          await prisma.paymentLink.delete({
            where: { id: paymentLink.id },
          });
          console.log('Create transaction reject!');
          console.log(createTransaction);
          return { error: true, message: 'Wystąpił błąd (2)' };
        }
      } catch (error) {
        console.log('! Payment Error');
        console.log(error);
        return { error: true, message: 'Wystąpił błąd (3)' };
      }
    }),
  paymentInfo: loggedInProcedure.input(z.object({ orderId: z.string() })).query(async ({ ctx, input }) => {
    const { prisma, user } = ctx;
    const { orderId } = input;

    if (!user.email) throw new TRPCError({ code: 'BAD_REQUEST' });

    try {
      const payment = await prisma.payment.findUnique({
        where: {
          cashbillId: orderId,
          OR: [
            {
              email: user.email,
            },
            {
              userId: user.id,
            },
          ],
        },
        select: {
          products: {
            select: {
              productCapacity: true,
              productName: true,
              productUnit: true,
              productPrice: true,
              productQuantity: true,
              originalProduct: {
                select: {
                  link: true,
                },
              },
            },
          },
          cashbillId: true,
          createdAt: true,
          shippingPrice: true,
          updatedAt: true,
          productsPrice: true,
          totalProducts: true,
          status: true,
        },
      });

      return payment;
    } catch {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }
  }),
});
