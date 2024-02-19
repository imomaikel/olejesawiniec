'use client';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/components/providers/TRPC';
import { Button } from '@/components/ui/button';
import CartItems from './_components/CartItems';
import { useCart } from '@/hooks/use-cart';
import { useEffect } from 'react';

const OrderPage = () => {
  const { onOpenChange: closeCart, cartData: _cartData } = useCart();

  useEffect(() => closeCart(), [closeCart]);

  const { data: cartData } = trpc.basket.get.useQuery(undefined, {
    retry: 1,
  });

  if (!cartData) return null;

  return (
    <div className="mb-12">
      <h1 className="text-2xl font-bold">Aktualny koszyk</h1>
      <CartItems items={cartData} />
      <Separator className="my-6" />
      <h1 className="text-2xl font-bold">Dostawa</h1>

      <Separator className="my-6" />
      <h1 className="text-2xl font-bold">Płatność</h1>
      <Button size="2xl" className="rounded-full">
        Przejdź do płatności
      </Button>
    </div>
  );
};

export default OrderPage;
