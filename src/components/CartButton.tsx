import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { useMobileNav } from '@/hooks/use-mobile-nav';
import { useCart } from '@/hooks/use-cart';

type TCartButton = {
  mobileVersion?: boolean;
};
const CartButton = ({ mobileVersion }: TCartButton) => {
  const { onOpen: onCartOpen } = useCart();
  const { onOpenChange } = useMobileNav();

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
    >
      <div className="flex">
        <div className="mt-1 mr-2">Koszyk</div>
        <div className="mt-1">0</div>
      </div>
      <HiOutlineShoppingBag className="h-6 w-6" />
    </div>
  );
};

export default CartButton;
