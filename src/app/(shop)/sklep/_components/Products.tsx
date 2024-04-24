'use client';
import { REPLACE_LETTERS, TSortOptions } from '@/utils/constans';
import { useEffect, useMemo, useState } from 'react';
import { trpc } from '@/components/providers/TRPC';
import { useSearchParams } from 'next/navigation';
import SortProducts from './SortProducts';
import ShopProduct from './ShopProduct';
import { fbPixel } from '@/lib/pixel';
import { cn } from '@/lib/utils';

const Products = () => {
  const searchParams = useSearchParams();
  const [orderBy, setOrderBy] = useState<TSortOptions | undefined>();

  const categories = searchParams.getAll('kategoria').join();
  const filterValue = searchParams.get('nazwa') || '';
  const tags = searchParams.getAll('tag').join();

  const [nameFilter, setNameFilter] = useState(filterValue);

  useEffect(() => {
    if (nameFilter.length >= 1) {
      fbPixel('Search');
    }
  }, [nameFilter]);

  if (filterValue !== nameFilter) {
    let filter = filterValue?.replace(/ /gi, '');
    REPLACE_LETTERS.forEach((letter) => (filter = filter!.replaceAll(letter.from, letter.to)));
    setNameFilter(filter);
  }

  useEffect(() => {
    const order = (searchParams.get('sortuj') || 'domyślnie') as TSortOptions;
    setOrderBy(order);
  }, [searchParams]);

  const { data: products, isLoading } = trpc.shop.getEnabledProducts.useQuery(
    { orderBy },
    {
      refetchOnWindowFocus: false,
    },
  );

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const tagsArr = tags.split(',');
    const categoriesArr = categories.split(',');
    let filtered = products;
    if (nameFilter.length >= 1) {
      filtered = products.filter(({ link }) =>
        link
          .toLowerCase()
          .replace(/-/gi, '')
          .includes(nameFilter ?? ''),
      );
    }
    if (tagsArr.length >= 1 && tagsArr[0] !== '') {
      filtered = filtered.filter((product) => {
        if (tagsArr.length <= 0) return true;
        if (!product.tags) return false;

        if (product.tags.some((tag) => tagsArr.includes(tag))) return true;
        return false;
      });
    }
    if (categoriesArr.length >= 1 && categoriesArr[0] !== '') {
      filtered = filtered.filter((product) => {
        if (categoriesArr.includes(product.category.label)) return true;
        return false;
      });
    }
    return filtered;
  }, [products, nameFilter, tags, categories]);

  const isFiltered = !!nameFilter || tags.length >= 1 || categories.length >= 1;

  return (
    <div className="flex flex-col w-full space-y-8">
      <div className="flex items-center justify-between flex-col md:flex-row">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">Nasze Produkty</h1>
          <p className="text-muted-foreground text-sm">Kliknij na produkt aby zobaczyć szczegóły.</p>
        </div>
        <SortProducts />
      </div>
      <div
        className={cn(
          isLoading
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5'
            : 'flex flex-row flex-wrap gap-5 justify-center',
        )}
      >
        {isLoading ? (
          <Products.Skeleton />
        ) : filteredProducts.length >= 1 ? (
          filteredProducts.map(({ label, link, mainPhoto, lowestPrice, highestPrice }) => {
            return (
              <ShopProduct
                label={label}
                image={mainPhoto ?? ''}
                link={link}
                key={link}
                lowestPrice={lowestPrice || undefined}
                highestPrice={highestPrice || undefined}
              />
            );
          })
        ) : isFiltered ? (
          'Brak produktów z podanymi filtrami.'
        ) : (
          'Aktualnie brak dostępnych produktów.'
        )}
      </div>
    </div>
  );
};
Products.Skeleton = function ShowSkeleton() {
  return [...Array.from(Array(9).keys())].map((index) => <ShopProduct.Skeleton key={`skeleton-${index}`} />);
};

export default Products;
