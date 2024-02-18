import CartItem from '@/components/CartItem';
import { TBasketVariant } from '@/lib/types';

const CartItems = ({ items }: { items: TBasketVariant[] }) => {
  return (
    <div className="max-w-sm space-y-2">
      {items.map((item) => (
        <CartItem
          quantity={item.quantity}
          variant={{
            capacity: item.variant.capacity,
            id: item.variant.id,
            price: item.variant.price,
            product: item.variant.product,
            unit: item.variant.unit,
          }}
          key={item.variant.id}
        />
      ))}
    </div>
  );
};

export default CartItems;
