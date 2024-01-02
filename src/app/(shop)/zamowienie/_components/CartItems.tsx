import CartItem from '@/components/CartItem';
import { TCartItem } from '@/hooks/use-cart';

type TCartItems = {
  items: TCartItem[];
};
const CartItems = ({ items }: TCartItems) => {
  return (
    <div className="max-w-sm space-y-2">
      {items.map((item) => (
        <CartItem
          key={item.variantId}
          image={item.image}
          productLabel={item.productLabel}
          productLink={item.productLink}
          quantity={item.quantity}
          variantCapacity={item.variantCapacity}
          variantId={item.variantId}
          variantPrice={item.variantPrice}
          variantUnit={item.variantUnit}
        />
      ))}
    </div>
  );
};

export default CartItems;
