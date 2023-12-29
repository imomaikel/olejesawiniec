'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Categories from './Categories';
import Search from './Search';
import Tags from './Tags';

const ProductControls = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <Search />
      <Categories />
      <Tags />
      <Separator />
      <Button variant="ghost" className="w-full" onClick={() => router.replace(pathname)}>
        Wyczyść filtry
      </Button>
    </>
  );
};

export default ProductControls;
