'use client';
import CheckVerification from './_components/CheckVerification';
import ProductControls from './_components/ProductControls';
import ScrollButton from '@/components/ScrollButton';
import Products from './_components/Products';
import { Suspense } from 'react';

const ShopPage = () => {
  return (
    <>
      <Suspense>
        <CheckVerification />
      </Suspense>
      <div className="flex space-x-0 md:space-x-12 mb-24">
        <div className="hidden md:flex flex-col space-y-6">
          {/* TODO */}
          <Suspense fallback="loading">
            <ProductControls />
          </Suspense>
        </div>
        <div className="flex w-full">
          {/* TODO */}
          <Suspense fallback="loading">
            <Products />
          </Suspense>
        </div>
      </div>
      <ScrollButton trackElementIdOrHeight={200} />
    </>
  );
};

export default ShopPage;
