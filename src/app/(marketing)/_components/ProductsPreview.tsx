'use client';
import ContentWrapper from '@/components/ContentWrapper';
import { TEMP_PRODUCTS } from '@/utils/constans';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import SectionInfo from './SectionInfo';
import { motion } from 'framer-motion';
import Product from './Product';

const ProductsPreview = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const vpWidth = isMounted ? window.innerWidth : null;

  return (
    <ContentWrapper className="bg-gray-100 relative">
      <div className="w-full flex justify-center flex-col items-center">
        <SectionInfo smallTitle="Nasze Produkty" bigTitle="Oleje Zimnotłoczone" className="mb-12" />
        <div className="grid gap-x-8 gap-y-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {[...TEMP_PRODUCTS, ...TEMP_PRODUCTS, ...TEMP_PRODUCTS, ...TEMP_PRODUCTS.slice(2)].map((product, index) => (
            <motion.div
              initial={{
                x: 100,
                opacity: 0,
              }}
              whileInView={{
                x: 0,
                opacity: 1,
              }}
              transition={{
                delay: vpWidth ? (vpWidth <= 1000 ? 0.1 : 0.1 * index) : 0.15 * index,
                damping: 30,
              }}
              viewport={{ once: true, amount: 0.25 }}
              key={product.label}
            >
              <Product
                id={product.label}
                description={product.description}
                image={product.image}
                label={product.label}
                price={product.price}
              />
            </motion.div>
          ))}
        </div>
        <div className="mt-12">
          <Button size="2xl" className="rounded-full shadow-md shadow-primary text-black">
            Zobacz Wszystkie Produkty
          </Button>
        </div>
        <div className="absolute w-screen h-full bg-gray-100 -z-10" />
      </div>
    </ContentWrapper>
  );
};

export default ProductsPreview;
