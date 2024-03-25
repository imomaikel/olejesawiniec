'use server';
import { ShippingType } from '@prisma/client';
import prisma from './prisma';

type TCalculateShipping = {
  method: ShippingType;
  productsTotalPrice: number;
};
export const calculateShipping = async ({
  method,
  productsTotalPrice,
}: TCalculateShipping): Promise<number | 'error'> => {
  const shopConfig = await prisma.shopConfig.findFirst();
  if (!shopConfig) return 'error';

  const { courierPrice, inpostFreeShippingOverPrice, inpostPrice } = shopConfig;

  if (method === 'COURIER') return courierPrice;

  if (method === 'INPOST') {
    if (productsTotalPrice >= inpostFreeShippingOverPrice) {
      return 0;
    } else {
      return inpostPrice;
    }
  }

  return 'error';
};
