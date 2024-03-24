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
    <Search.Body>
      <Input
        placeholder="Wpisz nazwe produktu..."
        ref={ref}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('nazwa')?.toString()}
        tabIndex={mobileVersion ? -1 : undefined}
      />
    </Search.Body>
  );
};
Search.Body = function ShowBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full md:w-[300px] relative z-10">
      <div className="flex items-center relative">
        <div>
          <h3 className="whitespace-nowrap font-medium">Szukaj produktu</h3>
        </div>
        <div className="border flex-1 mx-2" />
      </div>
      <div className="my-2">{children}</div>
    </div>
  );
};
Search.Skeleton = function ShowSkeleton() {
  return (
    <Search.Body>
      <Input placeholder="Wpisz nazwe produktu..." disabled />
    </Search.Body>
  );
};

export default Search;
