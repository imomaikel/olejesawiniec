'use client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { shopRouter } from '@/server/routers/shopRouter';
import { inferRouterOutputs } from '@trpc/server';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

type TProducts = inferRouterOutputs<typeof shopRouter>['getLandingPageProducts'];
type SingleProduct<T> = T extends Array<any> ? T[0] : undefined;

type TProductDetails = {
  product: SingleProduct<TProducts> | undefined;
  onBasketAdd: (link: string) => void;
  onClose: () => void;
};
const ProductDetails = ({ product, onBasketAdd, onClose }: TProductDetails) => {
  if (!product) return null;

  const { mainPhoto, label, lowestPrice, details, link } = product;

  const handleClose = () => {
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <Dialog defaultOpen onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[80vh]">
        <div className="flex md:divide-x-2 md:space-x-4 md:flex-row flex-col">
          <div className="relative mx-auto md:mx-0 w-[225px]">
            <Image
              src={mainPhoto!}
              loading="eager"
              width={0}
              height={0}
              sizes="100vw"
              alt={label}
              className="w-full h-full rounded-lg shadow-lg"
            />
          </div>
          <div className="flex flex-col px-6 space-y-2 justify-around">
            <div className="text-2xl font-medium text-center md:text-start mt-1 md:mt-0">{label}</div>
            <div className="text-primary text-3xl font-bold text-center md:text-start">{formatPrice(lowestPrice!)}</div>
            <ul className="list-disc max-w-md">
              {details.map(({ content }, id) => (
                <li key={`detail-${id}`} className="ml-2">
                  {content}
                </li>
              ))}
            </ul>
            <div className="flex md:space-x-4 flex-col md:flex-row space-y-1 md:space-y-0">
              <Button asChild variant="ghost">
                <Link href={`/sklep/${link}`}>Zobacz produkt</Link>
              </Button>
              <Button className="w-full rounded-full py-4" onClick={() => onBasketAdd(link)}>
                Dodaj do koszyka
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails;
