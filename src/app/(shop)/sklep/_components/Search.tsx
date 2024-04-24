'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ElementRef, useEffect, useRef } from 'react';
import { useDebounceValue } from 'usehooks-ts';
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
  const [debouncedValue, updateDebouncedValue] = useDebounceValue(searchValue, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedValue) {
      params.set('nazwa', debouncedValue);
    } else {
      params.delete('nazwa');
    }
    router.replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <Search.Body>
      <Input
        placeholder="Wpisz nazwe produktu..."
        ref={ref}
        onChange={(e) => updateDebouncedValue(e.target.value)}
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
