'use client';
import CheckVerification from './_components/CheckVerification';
import ProductControls from './_components/ProductControls';
import { Separator } from '@/components/ui/separator';
import ScrollButton from '@/components/ScrollButton';
import { Skeleton } from '@/components/ui/skeleton';
import Categories from './_components/Categories';
import Products from './_components/Products';
import Search from './_components/Search';
import Tags from './_components/Tags';
import { Suspense } from 'react';

const ShopPage = () => {
  return (
    <>
      <Suspense>
        <CheckVerification />
      </Suspense>
      <div className="flex space-x-0 md:space-x-12 mb-24">
        <div className="hidden md:flex flex-col space-y-6">
          <Suspense fallback={<ProductControlsFallback />}>
            <ProductControls />
          </Suspense>
        </div>
        <div className="flex w-full">
          <Suspense fallback={<ProductsFallback />}>
            <Products />
          </Suspense>
        </div>
      </div>
      <ScrollButton trackElementIdOrHeight={200} />
    </>
  );
};
const ProductControlsFallback = () => {
  return (
    <>
      <Search.Skeleton />
      <Categories.Skeleton />
      <Tags.Skeleton />
      <Separator />
      <Skeleton className="w-full h-9" />
    </>
  );
};
const ProductsFallback = () => {
  return (
    <div className="flex flex-col w-full space-y-8">
      <div className="flex items-center justify-between flex-col md:flex-row">
        <div className="flex flex-col">
          <Skeleton className="w-[285px] h-9 mb-1" />
          <Skeleton className="w-[285px] h-5" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        <Products.Skeleton />
      </div>
    </div>
  );
};

export default ShopPage;
