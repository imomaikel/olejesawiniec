'use client';
import { useCurrentUser } from '@/hooks/use-current-user';
import WishListItem from './_components/WishListItem';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/components/providers/TRPC';
import { FiChevronsRight } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const WishListPage = () => {
  const user = useCurrentUser();

  const { data, isLoading } = trpc.shop.getWishList.useQuery({ variantIds: user?.wishList! }, { enabled: !!user?.id });

  if (isLoading || !user || !data) return null;

  const wishList = data.wishList || [];

  return (
    <div className="mb-12">
      <div className="flex md:space-x-2 md:items-center mb-4 flex-col md:flex-row">
        <h1 className="text-2xl font-semibold">Twoja lista życzeń</h1>
        <Button variant="link" asChild className="p-0 md:px-4 md:py-2">
          <Link href="/sklep" className="!text-muted-foreground text-sm w-fit">
            Powrót do sklepu
            <FiChevronsRight className="ml-1" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {wishList.length >= 1 ? (
          wishList.map((variant) => (
            <WishListItem
              capacity={variant.capacity}
              price={variant.price}
              productImage={variant.product?.mainPhoto}
              productLabel={variant.product?.label ?? 'Produkt'}
              productLink={variant.product?.link ?? ''}
              stock={variant.stock}
              unit={variant.unit}
              key={variant.id}
              id={variant.id}
            />
          ))
        ) : (
          <p className="text-muted-foreground">Lista życzeń jest pusta.</p>
        )}
      </div>
    </div>
  );
};
WishListPage.Skeleton = function ShowSkeleton() {
  return (
    <div className="mb-12">
      <div className="flex md:space-x-2 md:items-center mb-4 flex-col md:flex-row">
        <Skeleton className="w-[215px] h-8" />
        <Skeleton className="w-[170px] h-7 mt-1" />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-[182px] w-full" />
        <Skeleton className="h-[182px] w-full" />
      </div>
    </div>
  );
};

export default WishListPage;
