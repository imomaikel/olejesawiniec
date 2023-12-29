'use client';
import AddTag from '../../produkty/tagi/_components/AddTag';
import { cn, errorToast, successToast } from '@/lib/utils';
import { trpc } from '@/components/providers/TRPC';
import { Badge } from '@/components/ui/badge';
import { ImSpinner9 } from 'react-icons/im';
import { IoOptions } from 'react-icons/io5';
import { Tag } from '@prisma/client';

type TTagControl = {
  productId: string;
  allTags: Tag[];
  productTags: Tag[];
  refetchProduct: () => void;
  refetchTag: () => void;
};
const TagControl = ({ allTags, productTags, productId, refetchTag, refetchProduct }: TTagControl) => {
  const { mutate: detachTag, isLoading: detachLoading } = trpc.panel.detachTag.useMutation({
    onSuccess: (message) => {
      refetchProduct();
      successToast(message);
    },
    onError: () => errorToast(),
  });

  const { mutate: appendTag, isLoading: appendLoading } = trpc.panel.appendTag.useMutation({
    onSuccess: ({ status, message }) => {
      if (status === 'error') {
        errorToast(message);
      } else {
        refetchProduct();
        successToast(message!);
      }
    },
    onError: ({ message }) => errorToast(message),
  });

  const isLoading = detachLoading || appendLoading;

  return (
    <div>
      <div className="flex">
        <IoOptions className="w-6 h-6 mr-2" />
        <h2 className="font-medium text-lg">Tagi produktu</h2>
      </div>
      <p className="text-muted-foreground">Kliknij na tag aby go dodać lub usunąć</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {allTags.map((tag) => {
          const { id, label } = tag;
          const isActive = productTags.find((entry) => entry.id === id);

          return (
            <Badge
              key={id}
              className="cursor-pointer relative"
              variant={isActive ? 'default' : 'secondary'}
              onClick={() => {
                if (isLoading) return;
                isActive
                  ? detachTag({ productId, tagId: id, tagLabel: label })
                  : appendTag({ productId, tagId: id, tagLabel: label });
              }}
            >
              {isLoading && (
                <div className="absolute w-full inset-0 flex items-center justify-center">
                  <ImSpinner9 className="animate-spin h-4 w-4" />
                </div>
              )}
              <span className={cn(isLoading && 'invisible')}>{label}</span>
            </Badge>
          );
        })}
      </div>
      <AddTag onAdd={refetchTag} singleMode />
    </div>
  );
};

export default TagControl;
