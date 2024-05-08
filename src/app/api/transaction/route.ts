import { formatPrice, getConfig, isDayOrNight } from '@/lib/utils';
import { getTransactionStatus } from '@/server/payments';
import { sendMail } from '@/server/mails/nodemailer';
import { getPaymentMode } from '@/utils/paymentMode';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'node:crypto';

const SHOP_SECRET = process.env.SHOP_SECRET;
const WEBHOOK_URL = `https://discord.com/api/webhooks/${process.env.WEBHOOK_ID}/${process.env.WEBHOOK_TOKEN}`;

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
      const updatedTransaction = await getTransactionStatus(orderId, await getPaymentMode());

      if (updatedTransaction.statusCode === 200) {
        const { status } = updatedTransaction;
        const payment = await prisma.payment
          .update({
            where: { cashbillId: updatedTransaction.id },
            data: {
              status,
            },
            include: {
              shipping: true,
              products: true,
            },
          })
          .catch(() => {});

        if (payment) {
          const config = await getConfig();
          const { email, products, shippingPrice, firstName: username, userId, notified } = payment;

          if (status === 'PositiveFinish' && !notified) {
            const totalPrice = products.reduce((acc, curr) => (acc += curr.productPrice * curr.productQuantity), 0);
            const embedProducts = products.map(
              ({ productName, productCapacity, productUnit, productQuantity }, index) =>
                `${index + 1}. **${productName}** ${productCapacity}${productUnit} x ${productQuantity}szt.`,
            );
            await fetch(WEBHOOK_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                embeds: [
                  {
                    title: 'Nowe zamówienie!',
                    description: `Skład zamówienia:\n${embedProducts.join('\n')}`,
                    url: `${process.env.NEXT_PUBLIC_SERVER_URL}/panel/zamowienia/${payment.cashbillId}`,
                    color: 3069299,
                    footer: {
                      text: `Zamówienie złożone przez: ${email}\nMetoda dostawy: ${
                        payment.shipping?.method === 'COURIER' ? 'Kurier za pobraniem' : 'Paczkomat'
                      }\nCałkowita cena produktów: ${formatPrice(totalPrice)}\nCałkowita cena dostawy: ${formatPrice(
                        shippingPrice,
                      )}\nCałkowita płatność: ${formatPrice(totalPrice + shippingPrice)}`,
                    },
                  },
                ],
              }),
            }).then(async () => {
              await prisma.payment.update({
                where: { cashbillId: updatedTransaction.id },
                data: {
                  notified: true,
                },
              });
            });
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

            if (userId) {
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
            }

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
          } else if (!notified) {
            await prisma.payment.update({
              where: { cashbillId: updatedTransaction.id },
              data: {
                status,
              },
            });
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
