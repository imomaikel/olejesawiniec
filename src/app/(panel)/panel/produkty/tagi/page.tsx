'use client';
import { cn, errorToast, successToast } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/components/providers/TRPC';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ImSpinner9 } from 'react-icons/im';
import AddTag from './_components/AddTag';
import { useState } from 'react';

const TagsPage = () => {
  const [filter, setFilter] = useState('');

  const {
    data: tagList,
    isLoading: isTagListLoading,
    refetch,
  } = trpc.getTagList.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const onChange = () => refetch();

  const { mutate: removeTag, isLoading: isRemoving } = trpc.panel.removeTag.useMutation({
    onSuccess: (message) => {
      successToast(message), onChange();
    },
    onError: () => errorToast(),
  });

  const onRemove = (tagName: string) => {
    if (!isRemoving)
      removeTag({
        tagName,
      });
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Current tags */}
      <div>
        <div>
          <h1 className="text-xl font-bold">Aktualne tagi</h1>
          <p className="text-muted-foreground">Kliknij na tag aby usunąć</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {tagList
            ? tagList
                .filter(({ label }) =>
                  label.replace(/ /gi, '').toLowerCase().includes(filter.replace(/ /gi, '').toLowerCase()),
                )
                .map(({ label }) => (
                  <Badge
                    className="cursor-pointer hover:bg-destructive relative"
                    key={label}
                    onClick={() => onRemove(label)}
                  >
                    {isRemoving && (
                      <div className="absolute w-full inset-0 flex items-center justify-center">
                        <ImSpinner9 className="animate-spin h-4 w-4" />
                      </div>
                    )}
                    <span className={cn(isRemoving && 'invisible')}>{label}</span>
                  </Badge>
                ))
            : [...Array.from(Array(12).keys())].map((index) => {
                const randomWidth = Math.floor(Math.random() * 150) + 50;
                return <Skeleton key={`skeleton${index}`} style={{ width: `${randomWidth}px`, height: '22px' }} />;
              })}
        </div>
      </div>
      {/* Search  */}
      <div>
        <h1 className="text-xl font-bold">Znajdź tag</h1>
        <p className="text-muted-foreground">Wpisz nazwę aby sprawdzić, czy istnieje</p>
        <Input
          className="max-w-xs w-full"
          placeholder="Nazwa"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      {/* Add a new */}
      <AddTag onAdd={onChange} />
    </div>
  );
};

export default TagsPage;
