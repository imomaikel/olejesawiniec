'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ElementRef, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';

type TSearch = {
  mobileVersion?: boolean;
};
const Search = ({ mobileVersion }: TSearch) => {
  const ref = useRef<ElementRef<'input'>>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const searchValue = searchParams.get('nazwa');

  useEffect(() => {
    if (searchValue === null) {
      if (ref.current) ref.current.value = '';
    }
  }, [searchValue]);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('nazwa', value);
    } else {
      params.delete('nazwa');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full md:w-[300px] relative z-10">
      <div className="flex items-center relative">
        <div>
          <h3 className="whitespace-nowrap font-medium">Szukaj produktu</h3>
        </div>
        <div className="border flex-1 mx-2" />
      </div>
      <div className="my-2">
        <Input
          placeholder="Wpisz nazwe produktu..."
          ref={ref}
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('nazwa')?.toString()}
          tabIndex={mobileVersion ? -1 : undefined}
        />
      </div>
      {/* <div className='w-full h-full absolute bg-gradient-to-r from-teal-200 to-lime-200 -z-10 inset-0 blur-[125px]' /> */}
    </div>
  );
};

export default Search;
