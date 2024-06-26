'use client';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCurrentUser } from '@/hooks/use-current-user';
import { FiChevronsRight } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import CustomFeature from './CustomFeature';
import { useCart } from '@/hooks/use-cart';
import { Separator } from './ui/separator';
import { formatPrice } from '@/lib/utils';
import { trpc } from './providers/TRPC';
import { Button } from './ui/button';
import CartItem from './CartItem';
import Image from 'next/image';
import Link from 'next/link';

const ShoppingCart = () => {
  const { isOpen, onOpenChange, cartData: _cartData } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const user = useCurrentUser();

  useEffect(() => setIsMounted(true), []);

  let { data: cartData } = trpc.basket.get.useQuery(undefined, {
    enabled: !!user && isMounted,
    retry: 1,
  });
  if (!!user === false) {
    cartData = _cartData;
  }
  if (!cartData) cartData = [];

  if (!isMounted) return null;

  const cartItems = cartData.reduce((acc, curr) => (acc += curr.quantity), 0);
  const cartItemsPrice = cartData.reduce((acc, curr) => (acc += curr.quantity * curr.variant.price), 0);

  return (
    <>
      <Sheet onOpenChange={onOpenChange} open={isOpen}>
        <SheetContent className="overflow-y-auto min-w-[330px]">
          <SheetHeader>
            <SheetTitle>Koszyk</SheetTitle>
            <SheetDescription>Produkty, które zostały dodane do koszyka</SheetDescription>
          </SheetHeader>
          {cartData.length <= 0 ? (
            <div className="relative w-full mt-12 z-10 flex items-center justify-center flex-col">
              <Image
                src="/empty-cart.webp"
                alt="puty koszyk"
                loading="eager"
                priority
                width={300}
                height={300}
                className="z-10 relative"
              />
              <div className="bg-gradient-to-r from-rose-400 to-orange-300 absolute w-1/2 h-1/2 inset-1/4 z-0 blur-[45px]" />
              <span className="text-sm text-muted-foreground">Koszyk jest pusty</span>
            </div>
          ) : (
            <>
              <div className="mt-4">
                <div className="font-medium text-xl md:text-2xl">Podsumowanie koszyka</div>
                <div className="mt-2 mb-4 space-y-1">
                  <div className="relative flex justify-between items-center">
                    <span>Ilość produktów</span>
                    <div className="h-0.5 bg-gray-300 flex flex-1 mx-4" />
                    <span>{cartItems} szt.</span>
                  </div>
                  <div className="relative flex justify-between items-center">
                    <span>Cena produktów</span>
                    <div className="h-0.5 bg-gray-300 flex flex-1 mx-4" />
                    <span>{formatPrice(cartItemsPrice)}</span>
                  </div>
                  <div className="relative flex justify-between items-center flex-col md:flex-row">
                    <span>Cena wysyłki</span>
                    <div className="h-0.5 bg-gray-300 flex-1 mx-4 hidden md:flex" />
                    <span>W następnym kroku</span>
                  </div>
                </div>
                <div>
                  <Button className="w-full rounded-full text-xl tracking-wider" size="lg" asChild>
                    <Link href="/zamowienie">
                      Przejdź dalej
                      <FiChevronsRight className="w-7 h-7 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="mt-4 flex flex-col gap-y-4">
                {cartData.map((item) => {
                  const productFeatures = item.variant.product?.customFeatures || [];
                  const categoryFeatures = item.variant.product?.category?.customFeatures || [];

                  for (const feature of categoryFeatures) {
                    if (!productFeatures.find((entry) => entry.id === feature.id)) {
                      productFeatures.push(feature);
                    }
                  }

                  return (
                    <CartItem
                      key={item.variant.id}
                      variant={{
                        capacity: item.variant.capacity,
                        id: item.variant.id,
                        price: item.variant.price,
                        product: item.variant.product,
                        unit: item.variant.unit,
                      }}
                      quantity={item.quantity}
                      features={productFeatures}
                    />
                  );
                })}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <CustomFeature />
    </>
  );
};

export default ShoppingCart;
