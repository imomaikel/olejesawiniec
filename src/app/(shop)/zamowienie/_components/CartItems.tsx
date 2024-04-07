import { TBasketVariantsSchema } from '@/lib/validators/order';
import CartItem from '@/components/CartItem';

const CartItems = ({ items }: { items: TBasketVariantsSchema }) => {
  return (
    <div className="flex flex-wrap gap-6">
      {items.map((item) => {
        const productFeatures = item.variant.product?.customFeatures || [];
        const categoryFeatures = item.variant.product?.category?.customFeatures || [];

        for (const feature of categoryFeatures) {
          if (!productFeatures.find((entry) => entry.id === feature.id)) {
            productFeatures.push(feature);
          }
        }

        return (
          <CartItem
            quantity={item.quantity}
            variant={{
              capacity: item.variant.capacity,
              id: item.variant.id,
              price: item.variant.price,
              product: item.variant.product,
              unit: item.variant.unit,
            }}
            features={productFeatures}
            key={item.variant.id}
          />
        );
      })}
    </div>
  );
};

export default CartItems;
