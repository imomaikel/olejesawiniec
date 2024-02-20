'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { trpc } from '@/components/providers/TRPC';
import { useMemo } from 'react';

const OrderSummaryPage = () => {
  const { data: payments, isLoading } = trpc.panel.getUncompletedOrders.useQuery();

  const products = useMemo(() => {
    if (!payments) return null;
    const products: { [key: string]: number } = {};

    for (const payment of payments) {
      for (const product of payment.products) {
        const variant = `${product.productName} ${product.productCapacity}${product.productUnit}`;
        if (products[variant]) {
          products[variant] = products[variant] + product.productQuantity;
        } else {
          products[variant] = product.productQuantity;
        }
      }
    }

    const output: { label: string; quantity: number }[] = [];

    for (const [key, value] of Object.entries(products)) {
      output.push({
        label: key,
        quantity: value,
      });
    }

    output.sort((a, b) => b.quantity - a.quantity);

    return output;
  }, [payments]);

  if (isLoading) return null;

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div>
        <h1 className="text-xl font-bold">Podsumowanie zamówień do skompletowania</h1>
      </div>
      <div>
        <Table className="max-w-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Produkt</TableHead>
              <TableHead>Ilość</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products ? (
              products.map((product) => (
                <TableRow key={product.label}>
                  <TableCell>{product.label}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-12 text-center">
                  Brak niezrealizowanych zamówień.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
