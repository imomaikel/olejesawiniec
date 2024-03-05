'use client';
import { REPLACE_LETTERS, SORT_OPTIONS } from '@/utils/constans';
import { trpc } from '@/components/providers/TRPC';
import { useSearchParams } from 'next/navigation';
import SortProducts from './SortProducts';
import ShopProduct from './ShopProduct';

const Products = () => {
  const searchParams = useSearchParams();

  const orderBy = (searchParams.get('sortuj') ?? 'popularność') as SORT_OPTIONS;
  const categories = searchParams.getAll('kategoria');
  const filterValue = searchParams.get('nazwa');
  const tags = searchParams.getAll('tag');

  let filter = filterValue?.replace(/ /gi, '');
  if (filter) {
    REPLACE_LETTERS.forEach((letter) => (filter = filter!.replaceAll(letter.from, letter.to)));
  }

  const { data, isLoading } = trpc.shop.getEnabledProducts.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  let products = data?.filter((product) => product.lowestPrice);

  // Filters
  if (products) {
    if (filter) {
      products = products.filter(({ link }) =>
        link
          .toLowerCase()
          .replace(/-/gi, '')
          .includes(filter ?? ''),
      );
    }
    if (tags.length >= 1) {
      products = products.filter((product) => {
        if (tags.length <= 0) return true;
        if (!product.tags) return false;

        if (product.tags.some((entry) => tags.includes(entry.label))) return true;
        return false;
      });
    }
    if (categories.length >= 1) {
      products = products.filter((product) => {
        if (categories.length <= 0) return true;

        if (categories.includes(product.category.label)) return true;
        return false;
      });
    }
  }

  // Sort
  if (products) {
    if (orderBy === 'alfabetycznie') {
      products.sort((a, b) => a.label.localeCompare(b.label));
    } else if (orderBy === 'cena_malejąco') {
      products.sort((a, b) => b.lowestPrice! - a.lowestPrice!);
    } else if (orderBy === 'cena_rosnąco') {
      products.sort((a, b) => a.lowestPrice! - b.lowestPrice!);
    } else if (orderBy === 'nowości') {
      products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (orderBy === 'opinie') {
      // TODO
    } else if (orderBy === 'popularność') {
      // TODO
    }
  }

  return (
    <div className="flex flex-col w-full space-y-8">
      <div className="flex items-center justify-between flex-col md:flex-row">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">Nasze Produkty</h1>
          <p className="text-muted-foreground text-sm">Kliknij na produkt aby zobaczyć szczegóły.</p>
        </div>
        <SortProducts />
      </div>
      <div className="flex flex-row flex-wrap gap-5 2xl:gap-10">
        {isLoading &&
          [...Array.from(Array(9).keys())].map((index) => <ShopProduct.Skeleton key={`skeleton-${index}`} />)}
        {products &&
          products?.length >= 1 &&
          products.map(({ label, link, mainPhoto, lowestPrice }) => {
            return <ShopProduct label={label} image={mainPhoto ?? ''} link={link} key={link} price={lowestPrice!} />;
          })}
        {!isLoading && (!products || products.length <= 0) && 'Brak dostępnych produktów'}
      </div>
    </div>
  );
};

export default Products;
