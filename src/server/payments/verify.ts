import { TBasketVariantsSchema } from '@/lib/validators/order';
import prisma from '@/lib/prisma';
import crypto from 'node:crypto';

export const verifyUserCart = async (
  cart: TBasketVariantsSchema,
): Promise<{
  updatedCart: TBasketVariantsSchema;
  hasChanged: boolean;
}> => {
  const ids = cart.map(({ variant }) => variant.id);

  const variants = await prisma.variant.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      product: {
        include: {
          customFeatures: true,
          category: {
            include: {
              customFeatures: true,
            },
          },
        },
      },
    },
  });

  const inputHash = crypto.createHash('md5').update(JSON.stringify(cart)).digest('hex');

  const updatedProducts: TBasketVariantsSchema = [];

  cart.forEach((item) => {
    const variant = variants.find((entry) => entry.id === item.variant.id);
    if (!variant) return;

    if (!variant.product?.enabled) return;

    // No stock
    if (variant.stock < item.quantity) {
      item.quantity = variant.stock;
    }
    if (item.quantity <= 0) {
      return;
    }

    updatedProducts.push({
      quantity: item.quantity,
      variant: {
        capacity: variant.capacity,
        id: variant.id,
        price: variant.price,
        unit: variant.unit,
        product: {
          id: variant.product.id,
          label: variant.product.label,
          link: variant.product.link,
          mainPhoto: variant.product.mainPhoto,
          customFeatures: variant.product.customFeatures,
          category: {
            customFeatures: variant.product.customFeatures,
          },
        },
      },
    });
  });

  const outputHash = crypto.createHash('md5').update(JSON.stringify(updatedProducts)).digest('hex');

  const hashChanged = inputHash !== outputHash;

  return {
    updatedCart: updatedProducts,
    hasChanged: hashChanged,
  };
};
