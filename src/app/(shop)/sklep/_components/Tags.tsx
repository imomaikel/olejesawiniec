'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/components/providers/TRPC';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Tags = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleTag = (tagLabel: string) => {
    const params = new URLSearchParams(searchParams);
    const alreadyExist = params.getAll('tag').includes(tagLabel);
    if (!alreadyExist) {
      params.append('tag', tagLabel);
    } else {
      params.delete('tag', tagLabel);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const { data: tags, isLoading } = trpc.getTagList.useQuery(undefined, { refetchOnWindowFocus: false });

  if (isLoading) return <Tags.Skeleton />;

  const tagsExist = !isLoading && tags && tags.length >= 1;

  return (
    <div className={cn('w-full md:w-[300px] relative z-10', !tagsExist && 'hiddexn')}>
      <div className="flex items-center relative">
        <div>
          <h3 className="whitespace-nowrap font-medium">Właściwości</h3>
        </div>
        <div className="border flex-1 mx-2" />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {tags?.map(({ id, label }) => {
          return (
            <Badge
              className="rounded-full cursor-pointer capitalize tracking-tight"
              variant={searchParams.getAll('tag').includes(label) ? 'default' : 'secondary'}
              key={id}
              onClick={() => handleTag(label)}
            >
              {label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
Tags.Skeleton = function ShowSkeleton() {
  return (
    <div className="w-full md:w-[300px] relative z-10">
      <div className="flex items-center relative">
        <div>
          <Skeleton className="w-16 h-6" />
        </div>
        <div className="border flex-1 mx-2" />
      </div>
      <div className="flex flex-wrap gap-x-1 gap-y-2 mt-2">
        {[117, 104, 40, 90, 106, 50].map((width) => (
          <Skeleton key={`tag-skeleton-${width}`} className="h-[22px]" style={{ width: `${width}px` }} />
        ))}
      </div>
      <Skeleton className="w-full h-9 mt-3" />
    </div>
  );
};

export default Tags;
