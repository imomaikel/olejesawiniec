'use client';
import ShopProduct from '@/app/(shop)/sklep/_components/ShopProduct';
import { trpc } from '@/components/providers/TRPC';

const PanelProductsPage = () => {
  const { data: products, isLoading } = trpc.panel.getAllProducts.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div>
        <h1 className="text-xl font-bold">Lista produktów</h1>
        <p className="text-muted-foreground">Kliknij na produkt aby go edytować</p>
      </div>
      <div className="grid gap-5 2xl:gap-10 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {isLoading
          ? [...Array.from(Array(12).keys())].map((index) => <ShopProduct.Skeleton key={`skeleton${index}`} />)
          : products
          ? products.map((product) => (
              <ShopProduct
                editMode
                image={product.mainPhoto}
                label={product.label}
                link={product.link}
                key={product.link}
              />
            ))
          : 'Brak produktów'}
      </div>
    </div>
  );
};

export default PanelProductsPage;
