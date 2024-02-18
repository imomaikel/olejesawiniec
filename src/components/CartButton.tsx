import { useCurrentUser } from '@/hooks/use-current-user';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { useMobileNav } from '@/hooks/use-mobile-nav';
import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { trpc } from './providers/TRPC';

type TCartButton = {
  mobileVersion?: boolean;
};
const CartButton = ({ mobileVersion }: TCartButton) => {
  const [isMounted, setIsMounted] = useState(false);
  const user = useCurrentUser();

  const { onOpen: onCartOpen, cartData: _cartData } = useCart();
  const { onOpenChange } = useMobileNav();

  useEffect(() => setIsMounted(true), []);

  let { data: cartData } = trpc.basket.get.useQuery(undefined, {
    enabled: !!user,
    retry: 1,
  });
  if (!!user === false) {
    cartData = _cartData;
  }
  if (!cartData) cartData = [];

  const cartItems = cartData.reduce((acc, curr) => (acc += curr.quantity), 0);

  return (
    <div
      className={
        mobileVersion
          ? 'flex my-6 items-center rounded-full border py-2 px-6 tracking-wide font-medium cursor-pointer transition-colors hover:border-primary justify-between'
          : 'ml-6 flex h-min items-center space-x-2 rounded-full border py-2 px-6 tracking-wide font-medium cursor-pointer transition-colors hover:border-primary'
      }
      onClick={() => {
        if (mobileVersion) {
          onOpenChange();
        }
        onCartOpen();
      }}
      role="button"
      aria-label="otwórz koszyk"
    >
      <div className="flex">
        <div className="mt-1 mr-2">Koszyk</div>
        <div className="mt-1 min-w-[25px] text-center">{isMounted ? cartItems : '0'}</div>
      </div>
      <HiOutlineShoppingBag className="h-6 w-6" />
    </div>
  );
};

export default CartButton;
