'use client';
import ContentWrapper from '@/components/ContentWrapper';
import { trpc } from '@/components/providers/TRPC';
import { Button } from '@/components/ui/button';
import SectionInfo from './SectionInfo';
import { motion } from 'framer-motion';
import Product from './Product';

const ProductsPreview = () => {
  const { data: products } = trpc.shop.getLandingPageProducts.useQuery(undefined, {
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (!products || products.length <= 0) return null;

  return (
    <ContentWrapper className="bg-gray-100 relative">
      <div className="w-full flex justify-center flex-col items-center">
        <SectionInfo smallTitle="Nasze Produkty" bigTitle="Oleje Zimnotłoczone" className="mb-12" />
        <motion.div className="grid gap-x-8 gap-y-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {products.map((product) => (
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
                damping: 30,
              }}
              viewport={{ once: true, amount: 0.25 }}
              key={product.label}
            >
              <Product
                description={product.details.map(({ content }) => content)}
                id={product.label}
                label={product.label}
                image={product.mainPhoto ?? ''}
                price={product.lowestPrice ?? 0}
              />
            </motion.div>
          ))}
        </motion.div>
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
