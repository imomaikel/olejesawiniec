import { getTransactionStatus } from '@/server/payments';
import { getConfig, isDayOrNight } from '@/lib/utils';
import { sendMail } from '@/server/mails/nodemailer';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'node:crypto';

const SHOP_SECRET = process.env.SHOP_SECRET;

const handler = async (req: NextRequest) => {
  try {
    const params = req.nextUrl.searchParams;

    const [cmd, args, sign] = [params.get('cmd'), params.get('args'), params.get('sign')];

    if (!cmd || !args || !sign) {
      return new Response('Bad Request', { status: 400 });
    }

    const toHash = cmd + args + SHOP_SECRET;

    const hash = crypto.createHash('md5');
    hash.update(toHash);

    const validSign = hash.digest('hex');

    if (sign !== validSign) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (cmd === 'transactionStatusChanged') {
      const orderId = args;
      // TODO
      const updatedTransaction = await getTransactionStatus(orderId, 'TEST');
      if (updatedTransaction.statusCode === 200) {
        const { status } = updatedTransaction;
        const payment = await prisma.payment
          .update({
            where: { cashbillId: updatedTransaction.id },
            data: {
              status,
            },
            include: {
              products: true,
            },
          })
          .catch(() => {});

        if (payment) {
          const config = await getConfig();
          const { email, products, shippingPrice, firstName: username, userId } = payment;

          await sendMail(
            'NewOrderMail',
            {
              dayOrNightTime: isDayOrNight(),
              orderId: updatedTransaction.id,
              orderUrl: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/zamowienie/${updatedTransaction.id}`,
              products: products.map((product) => ({
                label: product.productName,
                price: product.productPrice,
                quantity: product.productQuantity,
                variant: `${product.productCapacity}${product.productUnit}`,
              })),
              supportMail: config.supportMail,
              supportPhoneNumber: config.supportPhoneNumber,
              username,
              shippingPrice,
            },
            {
              sendTo: email,
              subject: 'Nowe zamówienie',
            },
          );

          await prisma.user.update({
            where: { id: userId },
            data: {
              basket: {
                update: {
                  variants: {
                    set: [],
                  },
                },
              },
            },
          });

          for await (const product of products) {
            if (!product.variantId) continue;
            try {
              await prisma.variant.update({
                where: { id: product.variantId },
                data: {
                  stock: {
                    decrement: product.productQuantity,
                  },
                },
              });
            } catch {}
          }
        }
      }
    }

    return new Response('OK', { status: 200 });
  } catch {
    return new Response('Bad Request', { status: 400 });
  }
};

export { handler as GET };
