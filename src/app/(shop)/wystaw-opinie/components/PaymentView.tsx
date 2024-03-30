import { shopRouter } from '@/server/routers/shopRouter';
import { formatPrice, relativeDate } from '@/lib/utils';
import { inferRouterOutputs } from '@trpc/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReviewProduct from './ReviewProduct';
import { BsStars } from 'react-icons/bs';
import { useState } from 'react';

type TPaymentView = {
  props: inferRouterOutputs<typeof shopRouter>['getProductsToReview'][0];
};
const PaymentView = ({ props }: TPaymentView) => {
  const [selectedProduct, setSelectedProduct] = useState<TPaymentView['props']['products'][0]>();
  const { cashbillId, createdAt, products, updatedAt } = props;

  return (
    <>
      <div className="bg-muted rounded-md max-w-lg w-full p-4">
        <div className="flex flex-col">
          <p className="text-muted-foreground text-sm">Zamówienie</p>
          <h2 className="text-2xl font-bold">{cashbillId}</h2>
        </div>
        <div>
          <p className="text-sm md:text-base">
            Zamówienie złożone: <Badge variant="outline">{relativeDate(createdAt)}</Badge>
          </p>
          <p className="text-sm md:text-base">
            Zamówienie zaktualizowane: <Badge variant="outline">{relativeDate(updatedAt)}</Badge>
          </p>
        </div>
        <div>
          <p>Produkty do oceny:</p>
          <div className="space-y-6">
            {products.map((product) => (
              <div
                key={`${cashbillId}${product.originalProductId}`}
                className="flex justify-between hover:bg-slate-200 transition-colors p-2 rounded-md"
              >
                <div>
                  <h3 className="text-lg font-bold">{product.productName}</h3>
                  <div>
                    <p className="text-muted-foreground">Zakupione pojemności:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.variants.map((variant) => (
                        <Badge
                          key={`${cashbillId}${product.originalProductId}${variant.capacity}`}
                          className="space-x-1 cursor-default"
                        >
                          <Badge variant="secondary" className="py-0 px-1">
                            {variant.capacity}
                            {variant.unit}
                          </Badge>
                          <Badge variant="secondary" className="py-0 px-1">
                            {variant.quantity}szt.
                          </Badge>

                          <Badge variant="secondary" className="py-0 px-1">
                            {formatPrice(variant.price)}
                          </Badge>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <Button className="h-full flex flex-col" onClick={() => setSelectedProduct(product)}>
                    <BsStars className="h-6 w-6 animate-bounce" />
                    <span className="text-xs mt-1 font-medium">Oceń</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ReviewProduct
        cashbillId={cashbillId}
        product={selectedProduct || null}
        onClose={() => setSelectedProduct(undefined)}
      />
    </>
  );
};

export default PaymentView;
