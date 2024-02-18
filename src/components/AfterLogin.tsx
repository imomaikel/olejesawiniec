'use client';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useCart } from '@/hooks/use-cart';
import { trpc } from './providers/TRPC';
import { useEffect } from 'react';

const AfterLogin = () => {
  const user = useCurrentUser();
  const { cartData, setCart } = useCart();
  const isLoggedIn = !!user;

  const { mutate: addToServerBasket } = trpc.basket.setQuantity.useMutation();

  useEffect(() => {
    if (!isLoggedIn) return;
    if (cartData.length <= 0) return;

    const variants = cartData;

    for (const item of variants) {
      addToServerBasket({
        newQuantity: item.quantity,
        variantId: item.variant.id,
      });
    }

    setCart([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return null;
};

export default AfterLogin;
