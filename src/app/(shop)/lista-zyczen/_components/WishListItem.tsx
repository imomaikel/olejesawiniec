'use client';
import { cn, errorToast, formatPrice, successToast } from '@/lib/utils';
import { trpc } from '@/components/providers/TRPC';
import { FaBottleDroplet } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ElementRef, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type TWishListItem = {
  productImage: string | undefined | null;
  productLabel: string;
  productLink: string;
  capacity: number;
  price: number;
  unit: string;
  stock: number;
  id: string;
};
const WishListItem = ({ capacity, price, productImage, productLabel, productLink, stock, unit, id }: TWishListItem) => {
  const ref = useRef<ElementRef<'div'>>(null);

  const { mutate: removeFromWishList, isLoading } = trpc.shop.removeFromWishList.useMutation({
    onSuccess: ({ error, success }) => {
      if (error) {
        errorToast();
      } else if (success) {
        ref.current?.remove();
        successToast('Usunięto z listy życzeń!');
      }
    },
    onError: () => errorToast(),
  });

  return (
    <div
      className={cn(
        'flex flex-col rounded-md p-4 transition-all shadow-lg h-full border hover:scale-105',
        stock >= 1 ? 'bg-primary/25 hover:bg-primary/50' : 'bg-destructive/25 hover:bg-destructive/50',
      )}
      ref={ref}
    >
      <div className="font-medium text-lg tracking-wide mb-2">
        {productLabel} ({formatPrice(price)})
      </div>
      <div className="flex space-x-2 md:space-x-6">
        <div className="flex-shrink-0">
          {productImage ? (
            <Image src={productImage} width={60} height={60} alt={productLabel} />
          ) : (
            <FaBottleDroplet className="h-16 w-16" />
          )}
        </div>
        <div className="flex flex-col space-y-2 w-full">
          <div className="flex h-min space-x-2">
            <div>Wybrany rozmiar:</div>
            <Badge>
              {capacity}
              {unit}
            </Badge>
          </div>
          <div className="text-sm">
            {stock >= 1 ? (
              <div>
                <p>Produkt jest aktualnie dostępny</p>
                <span>
                  Stan na magazynie wynosi <span className="font-bold">{stock}</span> szt.
                </span>
              </div>
            ) : (
              <div>
                <p>Aktualnie brakuje produktu na magazynie.</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2">
            <Button variant="link" size="sm" className="p-0 m-0">
              <Link href={`/sklep/${productLink}`} className="!text-black">
                Zobacz produkt
              </Link>
            </Button>
            <Button
              disabled={isLoading}
              variant="ghost"
              size="sm"
              onClick={() => removeFromWishList({ variantId: id })}
            >
              Usuń z listy życzeń
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishListItem;
