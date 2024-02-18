'use client';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/components/providers/TRPC';
import { Button } from '@/components/ui/button';
import CartItems from './_components/CartItems';
import { useCart } from '@/hooks/use-cart';
import InPost from './_components/InPost';
import { useEffect } from 'react';

const OrderPage = () => {
  const { onOpenChange: closeCart, cartData: _cartData, setCart } = useCart();
  const user = useCurrentUser();

  useEffect(() => closeCart(), [closeCart]);

  let { data: cartData } = trpc.basket.get.useQuery(undefined, {
    enabled: !!user,
    retry: 1,
  });
  if (!!user === false) {
    cartData = _cartData;
  }
  if (!cartData) cartData = [];

  // TODO
  const { data: updatedCart, isLoading } = trpc.shop.verifyCart.useQuery({ cart: cartData });

  useEffect(() => {
    if (!updatedCart) return;
    setCart(updatedCart);
  }, [updatedCart, setCart]);

  if (isLoading) return 'Verifying';

  return (
    <div className="mb-12">
      <h1 className="text-2xl font-bold">Aktualny koszyk</h1>
      <CartItems items={cartData} />
      <Separator className="my-6" />
      <h1 className="text-2xl font-bold">Dostawa</h1>
      <InPost />
      <Separator className="my-6" />
      <h1 className="text-2xl font-bold">Płatność</h1>
      <Button size="2xl" className="rounded-full">
        Przejdź do płatności
      </Button>
    </div>
  );
};

export default OrderPage;
