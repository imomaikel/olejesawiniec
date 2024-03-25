'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPrice, nextPaymentStep, relativeDate, translatePaymentStatus } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { trpc } from '@/components/providers/TRPC';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SyncLoader } from 'react-spinners';
import { useRef } from 'react';
import Link from 'next/link';

const PaymentPage = () => {
  const router = useRouter();
  const { cashbillId } = useParams<{ cashbillId: string }>();
  const enableRefetch = useRef(false);

  const { data: payment, isLoading } = trpc.basket.paymentInfo.useQuery(
    {
      orderId: cashbillId,
    },
    {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: !!cashbillId,
      refetchInterval: enableRefetch.current ? 2000 : false,
    },
  );

  // TODO skeleton
  if (isLoading) return <div>Loading</div>;

  if (!payment) {
    router.replace('/sklep');
    return;
  }

  if (payment.status === 'Start' || payment.status === 'PreStart') {
    enableRefetch.current = true;
  } else {
    enableRefetch.current = false;
  }

  const productsPrice = payment.products.reduce((acc, curr) => (acc += curr.productQuantity * curr.productPrice), 0);
  const nextPaymentStatus = nextPaymentStep(payment.status);

  return (
    <div className="flex flex-col space-y-6 mb-24">
      <div>
        <div className="text-muted-foreground">Zamówienie</div>
        <h1 className="font-bold text-4xl">{payment.cashbillId}</h1>
      </div>
      <div>
        <h2 className="text-2xl font-semibold">Status zamówienia</h2>
        <Badge className="px-6 py-1">{translatePaymentStatus(payment.status)}</Badge>
        {enableRefetch.current && (
          <div className="my-6 flex items-center space-x-2">
            <SyncLoader color="#4cd137" />
            <p className="font-semibold animate-pulse">Przetwarzanie zamówienia</p>
          </div>
        )}
        {nextPaymentStatus && (
          <div className="mt-2">
            <span>
              Następny status: <Badge variant="secondary">{nextPaymentStatus}</Badge>
            </span>
            <p className="text-muted-foreground text-sm">
              Informacja o zmianie statusu zostanie wysłana na adres email.
            </p>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-semibold">Zamówione produkty</h2>
        <Table className="w-[576px]">
          <TableHeader>
            <TableRow>
              <TableHead>Ilość</TableHead>
              <TableHead>Nazwa</TableHead>
              <TableHead>Pojemność</TableHead>
              <TableHead>Dodatkowe cechy</TableHead>
              <TableHead className="text-right">Cena</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payment.products.map((product, index) => (
              <TableRow key={`${index}-${product.productName}`}>
                <TableCell>{product.productQuantity}</TableCell>
                <TableCell>
                  {product.originalProduct?.link ? (
                    <Link href={product.originalProduct.link} className="underline">
                      {product.productName}
                    </Link>
                  ) : (
                    product.productName
                  )}
                </TableCell>
                <TableCell>
                  {product.productCapacity}
                  {product.productUnit}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 flex-wrap"></div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col">
                    <div className="text-muted-foreground">{formatPrice(product.productPrice)} / szt</div>
                    <div>Razem {formatPrice(product.productQuantity * product.productPrice)}</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* TODO */}
        <p className="text-sm text-muted-foreground">
          Po odebraniu produktów, zachęcamy do wystawienia opinii{' '}
          <Link href="/zamowienia" className="text-primary">
            tutaj
          </Link>
        </p>
      </div>
      <div className="w-full md:max-w-md">
        <h2 className="text-2xl font-semibold">Szczegóły zamówienia</h2>
        <div>
          <ul>
            <li>
              <div className="w-full flex items-center">
                <span>Zamówienie złożone</span>
                <div className="flex flex-1 h-[1px] bg-primary opacity-75 mx-4" />
                <span>{relativeDate(payment.createdAt)}</span>
              </div>
            </li>
            <li>
              <div className="w-full flex items-center">
                <span>Ostatnia aktualizacja</span>
                <div className="flex flex-1 h-[1px] bg-primary opacity-75 mx-4" />
                <span>{relativeDate(payment.updatedAt)}</span>
              </div>
            </li>
            <li>
              <div className="w-full flex items-center">
                <span>Cena produktów</span>
                <div className="flex flex-1 h-[1px] bg-primary opacity-75 mx-4" />
                <span>{formatPrice(productsPrice)}</span>
              </div>
            </li>
            <li>
              <div className="w-full flex items-center">
                <span>Cena przesyłki</span>
                <div className="flex flex-1 h-[1px] bg-primary opacity-75 mx-4" />
                <span>{formatPrice(payment.shippingPrice)}</span>
              </div>
            </li>
            <li>
              <div className="w-full flex items-center">
                <span>Cena całkowita</span>
                <div className="flex flex-1 h-[1px] bg-primary opacity-75 mx-4" />
                <span>{formatPrice(productsPrice + payment.shippingPrice)}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/sklep">Powrót do sklepu</Link>
        </Button>
        <Button asChild>
          {/* TODO */}
          <Link href="/zamowienia">Wcześniejsze zamówienia</Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;
// TODO shipping details
// TODO order status
// TODO nav link
