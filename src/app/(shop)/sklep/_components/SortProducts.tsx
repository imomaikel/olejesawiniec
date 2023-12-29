'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PopoverClose, PopoverTrigger } from '@radix-ui/react-popover';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { FaSortAlphaDown } from 'react-icons/fa';
import { SORT_OPTIONS } from '@/utils/constans';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const SortProducts = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const orderBy = searchParams.get('sortuj') ?? 'popularność';

  const handleCheckbox = (checked: boolean | string, label: string) => {
    if (typeof checked === 'string') return;
    const params = new URLSearchParams(searchParams);

    if (label === 'popularność') {
      params.delete('sortuj');
    } else {
      params.set('sortuj', label);
    }

    router.replace(`${pathname}?${params}`);
  };

  return (
    <div className="flex items-center space-x-1">
      <span className="text-muted-foreground">Sortuj według:</span>
      <span className="capitalize font-bold">Popularność</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon">
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
