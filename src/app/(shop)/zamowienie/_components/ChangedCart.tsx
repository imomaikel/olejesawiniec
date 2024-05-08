'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TBasketVariantsSchema } from '@/lib/validators/order';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { useMemo } from 'react';

type TChangedCart = {
  cart: TBasketVariantsSchema | undefined;
  isOpen: boolean | undefined;
  onClose: () => void | undefined;
  paymentUrl: string | undefined;
  shippingPrice: number | null | undefined;
};
const ChangedCart = ({ cart, isOpen, onClose, paymentUrl, shippingPrice }: TChangedCart) => {
  const productsPrice = useMemo(
    () => cart?.reduce((acc, curr) => (acc += curr.quantity * curr.variant.price), 0) || 0,
    [cart],
  );
  const totalPrice = (shippingPrice || 0) + (productsPrice || 0);
  const router = useRouter();

  const onProceed = () => {
    if (paymentUrl) {
      router.push(paymentUrl);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Twój koszyk został zaktualizowany.</DialogTitle>
          <DialogDescription>Upewnij się, że zamówienie jest poprawne.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produkt</TableHead>
                <TableHead>Pojemność</TableHead>
                <TableHead>Ilość</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart?.map((entry) => (
                <TableRow key={`updated-${entry.variant.id}`}>
                  <TableCell>{entry.variant.product?.label}</TableCell>
                  <TableCell>
                    {entry.variant.capacity}
                    {entry.variant.unit}
                  </TableCell>
                  <TableCell>{entry.quantity} szt.</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Cena produktów</TableCell>
                <TableCell className="text-center" colSpan={2}>
                  {formatPrice(productsPrice)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cena dosawy</TableCell>
                <TableCell className="text-center" colSpan={2}>
                  {formatPrice(shippingPrice || 0)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Cena całkowita</TableCell>
                <TableCell className="text-center font-bold" colSpan={2}>
                  {formatPrice(totalPrice)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={onClose}>
            Anuluj
          </Button>
          <Button onClick={onProceed} className="flex-2">
            Przejdź do płatności
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangedCart;
