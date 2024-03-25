'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PopoverClose, PopoverTrigger } from '@radix-ui/react-popover';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { SORT_OPTIONS, TSortOptions } from '@/utils/constans';
import { Checkbox } from '@/components/ui/checkbox';
import { FaSortAlphaDown } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useMemo } from 'react';

const SortProducts = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const orderBy = (searchParams.get('sortuj') || 'domyślnie') as TSortOptions;
  const displayName = useMemo(() => SORT_OPTIONS.find((entry) => entry.id === orderBy)?.label, [orderBy]);

  const handleCheckbox = (checked: boolean | string, label: string) => {
    if (typeof checked === 'string') return;
    const params = new URLSearchParams(searchParams);

    if (label === 'domyślnie') {
      params.delete('sortuj');
    } else {
      params.set('sortuj', label);
    }

    router.replace(`${pathname}?${params}`);
  };

  return (
    <div className="flex items-center space-x-1 flex-col lg:flex-row">
      <span className="text-muted-foreground">Sortuj według:</span>
      <span className="capitalize font-bold">{displayName || 'Domyślnie'}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" aria-label="pokaż menu">
            <FaSortAlphaDown className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px]">
          <div className="space-y-2">
            {SORT_OPTIONS.map(({ id, label }) => (
              <div key={`sort-${id}`} className="flex items-center space-x-2">
                <Checkbox
                  className="w-6 h-6"
                  id={id}
                  checked={orderBy === id}
                  onCheckedChange={(checked) => handleCheckbox(checked, id)}
                  aria-label={`sortuj według ${label}`}
                />
                <Label htmlFor={id}>{label}</Label>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <PopoverClose asChild>
              <Button variant="ghost" className="w-full">
                Zamknij
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SortProducts;
