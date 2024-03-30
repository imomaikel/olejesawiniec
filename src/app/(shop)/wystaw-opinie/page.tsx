'use client';
import { trpc } from '@/components/providers/TRPC';
import PaymentView from './components/PaymentView';
import Link from 'next/link';

const OpinionPage = () => {
  const { data: products, isLoading } = trpc.shop.getProductsToReview.useQuery();

  // TODO Skeleton
  if (isLoading) return 'Ładowanie';

  return (
    <div className="mb-12">
      <div className="flex mb-4 flex-col">
        <h1 className="text-2xl font-semibold">Oceń nasze produkty</h1>
        <p className="text-muted-foreground text-sm">
          Poniżej znajdziesz poprzednie płatności, z produktami które możesz ocenić.
        </p>
      </div>
      {!products || products.length <= 0 ? (
        <div>
          <p>Aktualnie brak produktów do oceny.</p>
          <p>
            Zachęcamy Państwa do odwiedzenia naszego{' '}
            <Link className="text-primary underline" href="/sklep">
              sklepu
            </Link>{' '}
            celem dokonania zakupu, a następnie powrotu tutaj, aby wyrazić opinię na temat każdego z nabytych produktów.
          </p>
        </div>
      ) : (
        <div className="flex gap-y-4 flex-col">
          {products.map((product) => (
            <PaymentView key={product.cashbillId} props={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OpinionPage;
