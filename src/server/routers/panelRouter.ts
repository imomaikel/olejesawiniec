import { DISALLOWED_PRODUCT_NAMES, PRODUCT_NAME_REGEX, REPLACE_LETTERS, TOrderStatus } from '@/utils/constans';
import { endOfMonth, endOfYear, format, getDaysInMonth, getMonth, startOfMonth, startOfYear } from 'date-fns';
import { PanelShippingConfigValidator, PanelVariantProductValidator } from '@/lib/validators/panel';
import { getConfig, getNextPaymentSteps, isDayOrNight, pad } from '@/lib/utils';
import { getPaymentMode } from '@/utils/paymentMode';
import { getTransactionStatus } from '../payments';
import { panelProcedure, router } from '../trpc';
import { sendMail } from '../mails/nodemailer';
import { handlePrismaError } from './errors';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

type TErrorStatus = {
  status: 'error';
  message?: string;
};
type TSuccessStatus = {
  status: 'success';
  message?: string;
};
type TPanelRouterResponse = TErrorStatus | TSuccessStatus;

const PRODUCT_NAME_MIN_LENGTH = 3;
const PRODUCT_NAME_MAX_LENGTH = 30;

const TAG_MIN_LENGTH = 2;
const TAG_MAX_LENGTH = 25;

export const panelRouter = router({
  createTag: panelProcedure
    .input(
      z.object({
        tagName: z
          .string()
          .min(TAG_MIN_LENGTH, { message: 'Tag jest za krótki.' })
          .max(TAG_MAX_LENGTH, { message: 'Tag jest za długi.' }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const tagName = input.tagName.toLowerCase();

      let message, status: TPanelRouterResponse['status'];

      try {
        await prisma.tag.create({
          data: {
            label: tagName,
          },
        });
        status = 'success';
        message = `Tag "${tagName}" został utworzony.`;
      } catch (error: any) {
        const translateError = handlePrismaError(error);
        if (translateError === 'Object already exists') message = 'Tag już istnieje.';
        status = 'error';
      }

      return {
        message,
        status,
      } as TPanelRouterResponse;
    }),
  removeTag: panelProcedure
    .input(z.object({ tagName: z.string().min(TAG_MIN_LENGTH).max(TAG_MAX_LENGTH) }))
    .mutation(async ({ ctx, input }) => {
      const { tagName } = input;
      const { prisma } = ctx;

      try {
        await prisma.tag.delete({
          where: {
            label: tagName,
          },
        });
        return `Tag "${tagName}" został usunięty.`;
      } catch {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  createProduct: panelProcedure
    .input(
      z.object({
        productName: z
          .string()
          .min(PRODUCT_NAME_MIN_LENGTH, {
            message: 'Nazwa produktu jest za krótka.',
          })
          .max(PRODUCT_NAME_MAX_LENGTH, {
            message: 'Nazwa produktu jest za długa.',
          }),
        categoryLabel: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { productName, categoryLabel } = input;
      let link = productName;
      const { prisma } = ctx;

      const getCategory = await prisma.category.findFirst({
        where: { label: categoryLabel },
      });

      if (!getCategory) {
        return {
          status: 'error',
          message: 'Nieprawidłowa kategoria!',
        };
      }

      REPLACE_LETTERS.forEach((letter) => (link = link.replaceAll(letter.from, letter.to)));

      try {
        let message, status: TPanelRouterResponse['status'];

        const isValid = PRODUCT_NAME_REGEX.test(productName);
        if (!isValid || DISALLOWED_PRODUCT_NAMES.includes(productName)) {
          message = 'Nieprawidłowa nazwa produktu.';
          status = 'error';
        } else {
          link = link.toLowerCase().trim().replace(/\s+/g, ' ').replace(/ /gi, '-');
          let query;
          try {
            query = await prisma.product.create({
              data: {
                label: productName,
                link,
                rating: 0,
                category: {
                  connect: {
                    id: getCategory.id,
                  },
                },
              },
            });
          } catch (error: any) {
            const translateError = handlePrismaError(error);
            if (translateError === 'Object already exists') message = `Produkt "${productName}" już istnieje.`;
          }
          if (query?.link) {
            (message = query.link), (status = 'success');
          } else {
            status = 'error';
          }
        }
        return {
          status,
          message,
        } as TPanelRouterResponse;
      } catch {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  getProductInfo: panelProcedure.input(z.object({ productLink: z.string() })).query(async ({ ctx, input }) => {
    const { productLink } = input;
    const { prisma } = ctx;

    try {
      const product = await prisma.product.findFirst({
        where: { link: productLink },
        include: {
          details: true,
          extraPhotos: true,
          nutritionFact: true,
          tags: true,
          variants: true,
          category: true,
        },
      });

      return product ?? null;
    } catch {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
  appendTag: panelProcedure
    .input(
      z.object({
        productId: z.string(),
        tagId: z.number(),
        tagLabel: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, tagId, tagLabel } = input;
      const { prisma } = ctx;

      let message, status: TPanelRouterResponse['status'];

      try {
        await prisma.product.update({
          where: {
            id: productId,

            tags: {
              none: {
                id: {
                  equals: tagId,
                },
              },
            },
          },
          data: {
            tags: {
              connect: { id: tagId },
            },
          },
        });
        message = `Dodano tag "${tagLabel}"`;
        status = 'success';
      } catch (error: any) {
        status = 'error';
        const translateError = handlePrismaError(error);
        if (translateError === 'Object already exists') {
          message = `Tag "${tagLabel}" jest już dodany`;
        }
      }
      return {
        status,
        message,
      } as TPanelRouterResponse;
    }),
  detachTag: panelProcedure
    .input(
      z.object({
        productId: z.string(),
        tagId: z.number(),
        tagLabel: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, tagId, tagLabel } = input;
      const { prisma } = ctx;

      try {
        await prisma.product.update({
          where: { id: productId },
          data: {
            tags: {
              disconnect: { id: tagId },
            },
          },
        });
        return `Usunięto tag "${tagLabel}"`;
      } catch {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  createVariant: panelProcedure.input(PanelVariantProductValidator).mutation(async ({ ctx, input }) => {
    const { options, productId } = input;
    const { capacity, price, stock, unit } = options;
    const { prisma } = ctx;

    let message, status: TPanelRouterResponse['status'];

    try {
      await prisma.product.update({
        where: { id: productId },
        data: {
          variants: {
            create: {
              capacity,
              price,
              stock: stock ?? 0,
              unit,
              parentId: productId,
              priceHistory: {
                create: {
                  price,
                },
              },
            },
          },
        },
      });
      await prisma.product
        .update({
          where: {
            id: productId,
            OR: [{ lowestPrice: { gt: price } }, { lowestPrice: { equals: null } }],
          },
          data: {
            lowestPrice: price,
          },
        })
        .catch(() => {});
      await prisma.product
        .update({
          where: {
            id: productId,
            OR: [{ highestPrice: { lt: price } }, { highestPrice: { equals: null } }],
          },
          data: {
            highestPrice: price,
          },
        })
        .catch(() => {});
      status = 'success';
      message = `Dodano opcję "${capacity}${unit}"`;
    } catch (error: any) {
      status = 'error';
      const translateError = handlePrismaError(error);
      if (translateError === 'Object already exists') {
        message = `Opcja "${capacity}${unit}" już istnieje`;
      } else {
        message = translateError;
      }
    }
    return {
      status,
      message,
    } as TPanelRouterResponse;
  }),
  updateVariant: panelProcedure
    .input(
      z.object({
        variantId: z.string(),
        price: z.number().min(1),
        stock: z.number().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { price, variantId, stock } = input;
      const { prisma } = ctx;

      try {
        const variant = await prisma.variant.update({
          where: { id: variantId },
          data: {
            price,
            stock,
            priceHistory: {
              create: {
                price,
              },
            },
          },
          include: {
            product: {
              include: {
                variants: true,
              },
            },
          },
        });

        const lowestPrice = variant.product?.variants.sort((a, b) => a.price - b.price)[0]?.price ?? null;
        const highestPrice = variant.product?.variants.sort((a, b) => b.price - a.price)[0]?.price ?? null;

        await prisma.product.updateMany({
          where: { id: variant.product?.id },
          data: { lowestPrice, highestPrice },
        });

        return true;
      } catch {
        return false;
      }
    }),
  removeVariant: panelProcedure
    .input(
      z.object({
        variantId: z.string(),
        productId: z.string(),
        capacityUnit: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { capacityUnit, variantId, productId } = input;
      const { prisma } = ctx;

      try {
        const product = await prisma.product.update({
          where: { id: productId },
          data: {
            variants: {
              delete: {
                id: variantId,
              },
            },
          },
          include: {
            variants: true,
          },
        });

        const lowestPrice = product.variants.sort((a, b) => a.price - b.price)[0]?.price ?? null;
        const highestPrice = product.variants.sort((a, b) => b.price - a.price)[0]?.price ?? null;

        await prisma.product.update({
          where: { id: productId },
          data: { lowestPrice, highestPrice },
        });

        return `Opcja "${capacityUnit}" została usunięta`;
      } catch (err) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  getAllProducts: panelProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const products = await prisma.product.findMany({
      include: {
        variants: true,
        customFeatures: true,
      },
    });

    return products;
  }),
  getAllCategories: panelProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const categories = await prisma.category.findMany({
      include: {
        customFeatures: true,
      },
    });

    return categories;
  }),
  productState: panelProcedure
    .input(
      z.object({
        productId: z.string(),
        newState: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, newState } = input;
      const { prisma } = ctx;

      try {
        await prisma.product.update({
          where: { id: productId, enabled: !newState },
          data: { enabled: newState },
        });
        return true;
      } catch {
        return false;
      }
    }),
  deleteProduct: panelProcedure.input(z.object({ productId: z.string() })).mutation(async ({ ctx, input }) => {
    const { productId } = input;
    const { prisma } = ctx;

    try {
      await prisma.product.delete({
        where: { id: productId },
      });
      return true;
    } catch {
      return false;
    }
  }),
  addDetail: panelProcedure
    .input(z.object({ detail: z.string(), productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { detail, productId } = input;
      const { prisma } = ctx;

      try {
        await prisma.product.update({
          where: { id: productId },
          data: {
            details: {
              create: {
                content: detail,
              },
            },
          },
        });
        return true;
      } catch {
        return false;
      }
    }),
  removeDetail: panelProcedure.input(z.object({ detailId: z.string() })).mutation(async ({ ctx, input }) => {
    const { detailId } = input;
    const { prisma } = ctx;

    try {
      await prisma.productDetail.delete({
        where: { id: detailId },
      });
      return true;
    } catch {
      return false;
    }
  }),
  updateDescription: panelProcedure
    .input(z.object({ description: z.string(), productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { description, productId } = input;
      const { prisma } = ctx;

      try {
        await prisma.product.update({
          where: { id: productId },
          data: { description },
        });
        return true;
      } catch {
        return false;
      }
    }),
  updateCalories: panelProcedure
    .input(
      z.object({
        fat: z.number().min(0).max(100),
        saturatedFat: z.number().min(0).max(100).optional(),
        monounsaturatedFat: z.number().min(0).max(100).optional(),
        polyunsaturatedFat: z.number().min(0).max(100).optional(),
        carbohydrate: z.number().min(0).max(100),
        carbohydrateSugar: z.number().min(0).max(100),
        fiber: z.number().min(0).max(100),
        protein: z.number().min(0).max(100),
        sodium: z.number().min(0).max(100),
        productId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const {
        carbohydrate,
        carbohydrateSugar,
        fat,
        fiber,
        protein,
        sodium,
        monounsaturatedFat,
        polyunsaturatedFat,
        saturatedFat,
        productId,
      } = input;

      let status = 'OK';

      if (carbohydrate + fat + fiber + protein + sodium !== 100) {
        status = 'Nieprawidłowa suma składników';
      } else if ((monounsaturatedFat ?? 0) + (polyunsaturatedFat ?? 0) + (saturatedFat ?? 0) > fat) {
        status = 'Nieprawidłowa suma tłuszczów';
      } else if (carbohydrateSugar > carbohydrate) {
        status = 'Nieprawidłowa suma węglowodanów';
      }

      if (status !== 'OK') {
        return status;
      }

      const newData = {
        carbohydrate,
        carbohydrateSugar,
        fat,
        fiber,
        monounsaturatedFat,
        polyunsaturatedFat,
        protein,
        saturatedFat,
        sodium,
      };

      try {
        const data = await prisma.product.findFirst({
          where: { id: productId },
          include: { nutritionFact: true },
        });

        let factId = '';

        if (data?.nutritionFact?.id) {
          factId = data.nutritionFact.id;
        }

        await prisma.product.update({
          where: { id: productId },
          data: {
            nutritionFact: {
              upsert: {
                where: { id: factId },
                update: newData,
                create: newData,
              },
            },
          },
        });
        return 'OK';
      } catch {
        return 'Błąd serwera.';
      }
    }),
  refetchProduct: panelProcedure.input(z.object({ productId: z.string() })).mutation(async ({ ctx, input }) => {
    const { productId } = input;
    const { prisma } = ctx;

    const product = await prisma.product.findFirst({
      where: { id: productId },
      include: { variants: true },
    });

    return product ?? null;
  }),
  createCategory: panelProcedure.input(z.object({ label: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    const { prisma } = ctx;
    const { label } = input;

    try {
      await prisma.category.create({
        data: { label },
      });

      return label;
    } catch {
      return null;
    }
  }),
  getUncompletedOrders: panelProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    try {
      const orders = await prisma.payment.findMany({
        where: {
          OR: [{ status: 'PositiveFinish' }, { status: 'Order_processing' }],
        },
        select: {
          products: {
            select: {
              productCapacity: true,
              productName: true,
              productQuantity: true,
              productUnit: true,
            },
          },
        },
      });
      return orders;
    } catch {
      return [];
    }
  }),
  addCustomFeatureToProduct: panelProcedure
    .input(z.object({ label: z.string().min(1), productId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { label, productId } = input;
      const { prisma } = ctx;

      try {
        await prisma.product.update({
          where: { id: productId },
          data: {
            customFeatures: {
              connectOrCreate: {
                where: {
                  label,
                },
                create: {
                  label,
                },
              },
            },
          },
        });

        return { success: true, message: `Dodano "${label}"` };
      } catch {
        return { error: true };
      }
    }),
  addCustomFeatureToCategory: panelProcedure
    .input(z.object({ label: z.string().min(1), categoryId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { label, categoryId } = input;
      const { prisma } = ctx;

      try {
        await prisma.category.update({
          where: { id: categoryId },
          data: {
            customFeatures: {
              connectOrCreate: {
                where: {
                  label,
                },
                create: {
                  label,
                },
              },
            },
          },
        });

        return { success: true, message: `Dodano "${label}"` };
      } catch {
        return { error: true };
      }
    }),
  removeCustomFeatureFromCategory: panelProcedure
    .input(z.object({ label: z.string().min(1), categoryId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { label, categoryId } = input;
      const { prisma } = ctx;

      try {
        await prisma.category.update({
          where: { id: categoryId },
          data: {
            customFeatures: {
              disconnect: {
                label,
              },
            },
          },
        });

        return { success: true, message: `Usunięto "${label}"` };
      } catch {
        return { error: true };
      }
    }),
  removeCustomFeatureFromProduct: panelProcedure
    .input(z.object({ label: z.string().min(1), productId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { label, productId } = input;
      const { prisma } = ctx;

      try {
        await prisma.product.update({
          where: { id: productId },
          data: {
            customFeatures: {
              disconnect: {
                label,
              },
            },
          },
        });

        return { success: true, message: `Usunięto "${label}"` };
      } catch {
        return { error: true };
      }
    }),
  createCustomFeature: panelProcedure.input(z.object({ label: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    const { label } = input;
    const { prisma } = ctx;

    try {
      await prisma.customFeature.create({
        data: { label },
      });

      return { success: true, message: `Dodano "${label}"` };
    } catch {
      return { error: true };
    }
  }),
  removeCustomFeature: panelProcedure.input(z.object({ label: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    const { label } = input;
    const { prisma } = ctx;

    try {
      await prisma.customFeature.delete({
        where: { label },
      });

      return { success: true, message: `Usunięto "${label}"` };
    } catch {
      return { error: true };
    }
  }),
  getCustomFeatues: panelProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const feature = await prisma.customFeature.findMany();

    return feature;
  }),
  getStatistics: panelProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const now = new Date();

    const firstDay = startOfMonth(now);
    const lastDay = endOfMonth(now);
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);
    const daysThisMonth = Array.from(Array(getDaysInMonth(now)).keys());
    const thisMonth = getMonth(now) + 1;
    const thisYear = format(now, 'yy');

    const payments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: firstDay,
          lte: lastDay,
        },
      },
      select: {
        productsPrice: true,
        createdAt: true,
      },
    });
    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: firstDay,
          lte: lastDay,
        },
      },
      select: {
        createdAt: true,
      },
    });
    const yearlyPayments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: yearStart,
          lte: yearEnd,
        },
      },
      select: {
        createdAt: true,
        productsPrice: true,
      },
    });

    type TStatsData = { label: string; value: number }[];
    const ordersThisMonth: TStatsData = [];
    const earningsThisMonth: TStatsData = [];
    const usersThisMonth: TStatsData = [];
    const yearlyEarnings: TStatsData = [];

    for (let i = 1; i <= 12; i++) {
      const ordersThisMonth = yearlyPayments.filter((payment) => payment.createdAt.getMonth() + 1 === i);
      const earnings = ordersThisMonth.reduce((acc, curr) => (acc += curr.productsPrice), 0);
      yearlyEarnings.push({
        label: `${pad(i)}.${thisYear}`,
        value: earnings,
      });
    }

    for (const entry in daysThisMonth) {
      const day = parseInt(entry) + 1;

      const ordersThisDay = payments.filter((payment) => payment.createdAt.getDate() === day);
      const usersThisDay = users.filter((user) => user.createdAt.getDate() === day);

      const orderCount = ordersThisDay.length;
      const usersCount = usersThisDay.length;
      const earnings = ordersThisDay.reduce((acc, curr) => (acc += curr.productsPrice), 0);

      ordersThisMonth.push({
        label: `${pad(day)}.${pad(thisMonth)}`,
        value: orderCount,
      });
      earningsThisMonth.push({
        label: `${pad(day)}.${pad(thisMonth)}`,
        value: earnings,
      });
      usersThisMonth.push({
        label: `${pad(day)}.${pad(thisMonth)}`,
        value: usersCount,
      });
    }

    return {
      ordersThisMonth,
      earningsThisMonth,
      usersThisMonth,
      yearlyEarnings,
    };
  }),
  getOrders: panelProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const orders = (
      await prisma.payment.findMany({
        where: {
          status: {
            in: [
              'PositiveFinish',
              'Order_processing',
              'Order_ready',
              'Order_sent',
              'Order_finished',
              'PreStart',
              'Start',
            ],
          },
        },
        select: {
          cashbillId: true,
          createdAt: true,
          productsPrice: true,
          status: true,
          totalProducts: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      })
    ).map((order) => ({
      id: order.cashbillId,
      date: order.createdAt,
      amount: order.productsPrice,
      userEmail: order.user.email ?? 'Błąd',
      status: order.status,
      productCount: order.totalProducts,
    }));

    return orders;
  }),
  getOrder: panelProcedure.input(z.object({ cashbillId: z.string().min(1) })).query(async ({ ctx, input }) => {
    const { cashbillId } = input;
    const { prisma } = ctx;

    const order = await prisma.payment.findUnique({
      where: { cashbillId },
      include: {
        products: {
          include: {
            originalProduct: {
              select: {
                link: true,
                enabled: true,
              },
            },
          },
        },
        shipping: true,
        user: {
          select: {
            id: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return order;
  }),
  verifyOrder: panelProcedure.input(z.object({ cashbillId: z.string().min(1) })).mutation(async ({ input }) => {
    const { cashbillId } = input;

    const payment = await getTransactionStatus(cashbillId, await getPaymentMode());

    if (payment.statusCode === 200) {
      const { amount, personalData, requestedAmount, status } = payment;
      return { success: true, amount, personalData, requestedAmount, status };
    }
    return { error: true, message: payment.errorMessage };
  }),
  changeOrderStatus: panelProcedure
    .input(z.object({ cashbillId: z.string().min(1), nextStatus: z.custom<TOrderStatus>(), sendMail: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { cashbillId, nextStatus, sendMail: sendMailToUser } = input;
      const { prisma } = ctx;

      try {
        const order = await prisma.payment.findUnique({
          where: { cashbillId },
        });

        const currentStatus = order?.status;
        if (!currentStatus) {
          return { error: true, message: 'Wystąpił błąd!' };
        }

        const possibleSteps = getNextPaymentSteps(currentStatus);
        const canChange = possibleSteps.find((entry) => entry.key === nextStatus);

        if (!canChange) {
          return { error: true, message: 'Nie udało się zmienić statusu!' };
        }

        await prisma.payment.update({
          where: { cashbillId },
          data: {
            status: canChange.key,
          },
        });

        const { supportPhoneNumber, supportMail } = await getConfig();

        if (sendMailToUser) {
          const nextSteps = getNextPaymentSteps(canChange.key);
          const nextPaymentStep = nextSteps[0] ? nextSteps[0].key : undefined;
          await sendMail(
            'OrderUpdateMail',
            {
              dayOrNightTime: isDayOrNight(),
              newOrderStatus: canChange.key,
              oldOrderStatus: currentStatus,
              nextOrderStatus: nextPaymentStep,
              orderId: cashbillId,
              supportPhoneNumber,
              supportMail,
              orderUrl: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/zamowienie/${cashbillId}`,
              username: order.firstName,
            },
            {
              sendTo: order.email,
              subject: 'Aktualizacja zamówienia',
            },
          );
        }

        return { success: true, message: 'Status zmieniony!' };
      } catch (err) {
        console.log(err);
        return { error: true, message: 'Wystąpił błąd!' };
      }
    }),
  updateShippingPrice: panelProcedure.input(PanelShippingConfigValidator).mutation(async ({ ctx, input }) => {
    const { prisma } = ctx;

    try {
      await prisma.shopConfig.updateMany({
        data: { ...input },
      });

      return { success: true };
    } catch {
      return { error: true };
    }
  }),
});
