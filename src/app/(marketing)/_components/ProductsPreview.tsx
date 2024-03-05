'use client';
import { itemSlide, staggerContainer } from '@/utils/motion';
import ContentWrapper from '@/components/ContentWrapper';
import { trpc } from '@/components/providers/TRPC';
import { Button } from '@/components/ui/button';
import ProductDetails from './ProductDetails';
import VariantPicker from './VariantPicker';
import SectionInfo from './SectionInfo';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Product from './Product';
import Link from 'next/link';

type SingleProduct<T> = T extends Array<any> ? T[0] : undefined;

const ProductsPreview = () => {
  const { data: products } = trpc.shop.getLandingPageProducts.useQuery(undefined, {
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const [productLinkShowDescription, setProductLinkShowDescription] = useState<SingleProduct<typeof products>>();
  const [productLinkShowVariants, setProductLinkShowVariants] = useState<SingleProduct<typeof products>>();

  const handleBasketAdd = (link: string) => {
    const product = products?.find((entry) => entry.link === link);
    setProductLinkShowVariants(product);
  };
  const handleShowDescription = (link: string) => {
    const product = products?.find((entry) => entry.link === link);
    setProductLinkShowDescription(product);
  };

  if (!products || products.length <= 0) return null;

  return (
    <>
      <ContentWrapper className="bg-gray-100 relative">
        <div className="w-full flex justify-center flex-col items-center">
          <SectionInfo smallTitle="Wybrane Produkty" bigTitle="Oleje Zimnotłoczone" className="mb-12" />
          <p className="text-muted-foreground text-sm md:hidden -translate-y-12">Kliknij na produkt, aby rozwinąć.</p>

          <motion.div
            variants={staggerContainer(0.15)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-row flex-wrap gap-5 2xl:gap-10 justify-center"
          >
            {products.map((product) => (
              <motion.div variants={itemSlide(0, 100)} key={product.label}>
                <Product
                  description={product.details.map(({ content }) => content)}
                  link={product.link}
                  label={product.label}
                  image={product.mainPhoto ?? ''}
                  price={product.lowestPrice ?? 0}
                  onBasketAdd={() => handleBasketAdd(product.link)}
                  onShowDescription={() => handleShowDescription(product.link)}
                />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-12">
            <Button size="2xl" className="rounded-full shadow-md shadow-primary text-black" asChild>
              <Link href="/sklep">Zobacz Wszystkie Produkty</Link>
            </Button>
          </div>
          <div className="absolute w-screen h-full bg-gray-100 -z-10" />
        </div>
      </ContentWrapper>
      <ProductDetails
        product={productLinkShowDescription}
        onBasketAdd={handleBasketAdd}
        onClose={() => setProductLinkShowDescription(undefined)}
      />
      <VariantPicker onClose={() => setProductLinkShowVariants(undefined)} product={productLinkShowVariants} />
    </>
  );
};

export default ProductsPreview;
