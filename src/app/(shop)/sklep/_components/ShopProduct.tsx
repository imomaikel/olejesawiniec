'use client';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { BsDashLg } from 'react-icons/bs';
import Image from 'next/image';
import Link from 'next/link';

type TShopProduct = {
  link: string;
  label: string;
  image: string | null;
  lowestPrice?: number;
  highestPrice?: number;
  editMode?: boolean;
};
const ShopProduct = ({ link, image, label, lowestPrice, highestPrice, editMode }: TShopProduct) => {
  const productLink = editMode ? `/panel/produkty/${link}` : `/sklep/${link}`;

  return (
    <Link href={productLink}>
      <div className="shadow-2xl rounded-xl hover:scale-105 transition-transform cursor-pointer ring-1 ring-primary/10 z-20 hover:z-10 h-full flex flex-0 flex-col justify-around">
        <div className="relative max-h-96">
          {image ? (
            <Image
              src={image}
              width={0}
              height={0}
              sizes="100vw"
              quality={70}
              loading="eager"
              className="h-full w-full max-h-96 object-contain object-center rounded-tr-xl rounded-tl-xl"
              alt={label}
            />
          ) : (
            <div className="w-full h-full items-center justify-center flex flex-col">
              <MdOutlineImageNotSupported className="h-48 w-48" />
              <span className="mt-1">Brak Zdjęcia</span>
            </div>
          )}
        </div>
        <div className="py-2 px-4 text-center flex flex-col">
          <span className="font-medium tracking-wide mb-1">{label}</span>
          <div className="flex justify-center items-center">
            {!editMode && lowestPrice && <span className="text-primary font-bold">{formatPrice(lowestPrice)}</span>}
            {!editMode && highestPrice && (
              <div className="flex items-center">
                <div className="font-semibold mx-1">
                  <BsDashLg />
                </div>
                <span className="text-primary font-bold">{formatPrice(highestPrice)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

ShopProduct.Skeleton = function ShowSkeleton() {
  return (
    <div className="shadow-2xl rounded-xl hover:scale-105 transition-transform cursor-pointer ring-1 ring-primary/10 z-20 hover:z-10 flex flex-0 flex-col justify-around h-[447px] w-full">
      <Skeleton className="w-auto h-96 relative flex flex-col items-center" />
      <div className="py-2 px-4 text-center flex flex-col">
        <Skeleton className="h-6 w-3/4 mx-auto mb-1" />
        <Skeleton className="h-6 w-1/4 mx-auto" />
      </div>
    </div>
  );
};

export default ShopProduct;
