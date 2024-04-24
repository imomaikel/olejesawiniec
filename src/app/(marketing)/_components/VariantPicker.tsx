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
import { useCurrentUser } from '@/hooks/use-current-user';
import { shopRouter } from '@/server/routers/shopRouter';
import { errorToast, formatPrice } from '@/lib/utils';
import { trpc } from '@/components/providers/TRPC';
import { inferRouterOutputs } from '@trpc/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { fbPixel } from '@/lib/pixel';
import { toast } from 'sonner';
import Link from 'next/link';

type TProducts = inferRouterOutputs<typeof shopRouter>['getLandingPageProducts'];
type SingleProduct<T> = T extends Array<any> ? T[0] : undefined;

type TVariantPicker = {
  product: SingleProduct<TProducts> | undefined;
  onClose: () => void;
};
const VariantPicker = ({ onClose, product }: TVariantPicker) => {
  const { addProduct: _addProduct, onOpen, cartData } = useCart();
  const user = useCurrentUser();

  const handleClose = () => {
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const { mutate: serverAddToBasket, isLoading: isAdding } = trpc.basket.add.useMutation();
  const { mutate: verifyCartItem, isLoading } = trpc.shop.verifyCartItem.useMutation();

  const handleBasketAdd = (variantId: string) => {
    if (!!user) {
      serverAddToBasket(
        { variantId },
        {
          onSuccess: ({ message, error, success }) => {
            if (success) {
              fbPixel('AddToCart');
              toast.success(message);
              onOpen();
              // refetch();
            } else if (error) {
              errorToast(message);
            }
          },
          onError: () => errorToast(),
        },
      );
    } else {
      const currentQuantity = cartData.find((entry) => entry.variant.id === variantId)?.quantity ?? 0;
      verifyCartItem(
        { variantId, currentQuantity },
        {
          onSuccess: (response) => {
            if (response === true) {
              const variant = product?.variants.find((entry) => entry.id === variantId);
              const mainPhoto = product?.mainPhoto ?? null;
              if (!variant) return;
              fbPixel('AddToCart');
              _addProduct({
                variant: {
                  product: {
                    mainPhoto,
                    label: product?.label!,
                    link,
                  },
                  capacity: variant.capacity,
                  id: variant.id,
                  price: variant.price,
                  unit: variant.unit,
                },
                quantity: 1,
              });
              toast.success(`Dodano "${product?.label}" do koszyka!`);
              onOpen();
            } else {
              toast.error(response);
            }
          },
          onError: () => errorToast(),
        },
      );
    }
  };

  if (!product) return null;

  const { label, link, variants } = product;

  return (
    <Dialog defaultOpen onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>Wybierz pojemność, którą chcesz dodać do koszyka.</DialogDescription>
        </DialogHeader>
        <div>
          <p className="font-semibold">Aktualne pojemnośći</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pojemność</TableHead>
                <TableHead>Stan magazynowy</TableHead>
                <TableHead>Cena</TableHead>
                <TableHead>Koszyk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((entry) => {
                const inStock = entry.stock >= 1;
                return (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Badge variant={inStock ? 'default' : 'destructive'}>
                        {entry.capacity}
                        {entry.unit}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.stock}</TableCell>
                    <TableCell>{formatPrice(entry.price)}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleBasketAdd(entry.id)} disabled={isLoading || isAdding}>
                        Dodaj
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button variant="ghost" asChild>
            <Link href={`/sklep/${link}`}>Zobacz produkt</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VariantPicker;
