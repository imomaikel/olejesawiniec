'use server';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import Link from 'next/link';

const CancelledPaymentPage = async ({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) => {
  const id = searchParams && searchParams.id;

  const checkoutUrl = id
    ? (
        await prisma.paymentLink.findUnique({
          where: { id },
          select: {
            checkoutUrl: true,
          },
        })
      )?.checkoutUrl
    : null;

  return (
    <div>
      <h1 className="font-bold text-4xl">Płatność wstrzymana</h1>
      <p className="text-muted-foreground">Proces płatności został wstrzymany</p>

      {checkoutUrl && (
        <div className="mt-4">
          <p className="text-muted-foreground">Powrót do płatności</p>
          <Button asChild>
            <Link href={checkoutUrl}>Kliknij aby powrócić do płatności</Link>
          </Button>
        </div>
      )}

      <Button className="mt-6 max-w-md w-full" asChild>
        <Link href="/sklep">Powrót do sklepu</Link>
      </Button>
    </div>
  );
};

export default CancelledPaymentPage;
