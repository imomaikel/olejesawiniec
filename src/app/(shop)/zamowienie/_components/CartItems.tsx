import { TBasketVariantsSchema } from '@/lib/validators/order';
import CartItem from '@/components/CartItem';

const CartItems = ({ items }: { items: TBasketVariantsSchema }) => {
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
