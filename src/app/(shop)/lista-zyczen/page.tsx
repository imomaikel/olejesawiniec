'use client';
import { useCurrentUser } from '@/hooks/use-current-user';
import WishListItem from './_components/WishListItem';
import { trpc } from '@/components/providers/TRPC';
import { FiChevronsRight } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const WishListPage = () => {
  const user = useCurrentUser();

  const { data: wishList, isLoading } = trpc.shop.getWishList.useQuery(
    { variantIds: user?.wishList! },
    { enabled: !!user?.id },
  );

  if (isLoading || !user) return 'Loading...';

  return (
    <div className="mb-12">
      <div className="flex space-x-2 items-center mb-4">
        <h1 className="text-2xl font-semibold">Twoja lista życzeń</h1>
        <Button variant="link" asChild>
          <Link href="/sklep" className="!text-muted-foreground text-sm">
            Powrót do sklepu
            <FiChevronsRight className="ml-1" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {wishList?.success &&
          wishList.success.map((variant) => (
            <WishListItem
              capacity={variant.capacity}
              price={variant.price}
              productImage={variant.Product?.mainPhoto}
              productLabel={variant.Product?.label ?? 'Produkt'}
              productLink={variant.Product?.link ?? ''}
              stock={variant.stock}
              unit={variant.unit}
              key={variant.id}
              id={variant.id}
            />
          ))}
      </div>
    </div>
  );
};

export default WishListPage;

// TODO middleware
