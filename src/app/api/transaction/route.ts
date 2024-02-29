import { getTransactionStatus } from '@/server/payments';
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
        await prisma.payment
          .update({
            where: { cashbillId: updatedTransaction.id },
            data: {
              status,
            },
          })
          .catch(() => {});
        // TODO Update basket and stock
      }
    }

    return new Response('OK', { status: 200 });
  } catch {
    return new Response('Bad Request', { status: 400 });
  }
};

export { handler as GET };
