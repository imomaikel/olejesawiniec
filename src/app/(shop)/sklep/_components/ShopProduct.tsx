'use client';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

type TShopProduct = {
  link: string;
  label: string;
  image: string | null;
  price?: number;
  editMode?: boolean;
};
const ShopProduct = ({ link, image, label, price, editMode }: TShopProduct) => {
  const productLink = editMode ? `/panel/produkty/${link}` : `/sklep/${link}`;

  return (
    <Link href={productLink}>
      <div className="shadow-2xl rounded-xl hover:scale-105 transition-transform cursor-pointer ring-1 ring-primary/10 z-20 hover:z-10 relative h-full flex flex-col justify-around">
        <div className="relative max-w-[225px] flex">
          {image ? (
            <Image
              src={image}
              width={0}
              height={0}
              sizes="100vw"
              loading="eager"
              className="h-full w-full object-cover object-center"
              alt={label}
            />
          ) : (
            <div className="w-full h-full items-center justify-center flex flex-col">
              <MdOutlineImageNotSupported className="h-48 w-48" />
              <span className="mt-1">Brak Zdjęcia</span>
            </div>
          )}
        </div>
        <div className="py-2 px-4 text-center flex flex-col max-w-[225px]">
          <span className="font-medium tracking-wide mb-1">{label}</span>
          {!editMode && price && <span className="text-primary font-bold">{formatPrice(price)}</span>}
        </div>
      </div>
    </Link>
  );
};

ShopProduct.Skeleton = function ShowSkeleton() {
  return (
    <div className="shadow-2xl overflow-hidden bg-white rounded-xl hover:scale-105 transition-transform cursor-pointer ring-1 ring-primary/10 z-20 hover:z-10 relative w-[225px] h-[400px]">
      <Skeleton className="w-auto h-[300px] relative flex flex-col items-center" />
      <div className="py-2 px-4 text-center flex flex-col w-[225px]">
        <Skeleton className="h-6 w-3/4 mx-auto mb-1" />
        <Skeleton className="h-6 w-1/4 mx-auto" />
      </div>
    </div>
  );
};

export default ShopProduct;
