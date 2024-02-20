import { Separator } from '@/components/ui/separator';
import React, { useEffect, useState } from 'react';
import { trpc } from '@/components/providers/TRPC';
import { Badge } from '@/components/ui/badge';
import { ImSpinner9 } from 'react-icons/im';
import { cn, errorToast } from '@/lib/utils';
import DropBox from './DropBox';
import { toast } from 'sonner';

type TCategoryBox = {
  id: string;
  label: string;
  features: {
    id: number;
    label: string;
  }[];
  allFeatures: number[];
  refetch: () => void;
};
const CategoryBox = ({ id, label, features: _features, allFeatures, refetch }: TCategoryBox) => {
  const [features, setFeatures] = useState(_features);

  useEffect(() => {
    setFeatures((prev) => prev.filter((entry) => allFeatures.includes(entry.id)));
  }, [allFeatures]);

  const onDrop = (label: string, featureId: number) => {
    addCustomFeatureToCategory(
      { categoryId: id, label },
      {
        onError: () => errorToast(),
        onSuccess: ({ error, message, success }) => {
          if (success) {
            if (!features.some((entry) => entry.id === featureId)) {
              setFeatures([...features, { id: featureId, label }]);
            }
            refetch();
            toast.success(message);
          } else if (error) {
            errorToast();
          }
        },
      },
    );
  };
  const onDelete = (featureLabel: string, featureId: number) => {
    removeCustomFeatureFromCategory(
      { categoryId: id, label: featureLabel },
      {
        onError: () => errorToast(),
        onSuccess: ({ error, message, success }) => {
          if (success) {
            setFeatures(features.filter((entry) => entry.id !== featureId));
            toast.success(message);
          } else if (error) {
            errorToast();
          }
        },
      },
    );
  };

  const { mutate: addCustomFeatureToCategory, isLoading: isAdding } =
    trpc.panel.addCustomFeatureToCategory.useMutation();

  const { mutate: removeCustomFeatureFromCategory, isLoading: isRemoving } =
    trpc.panel.removeCustomFeatureFromCategory.useMutation();

  const isLoading = isAdding || isRemoving;

  return (
    <DropBox onDrop={onDrop}>
      <div key={id} className="flex flex-col max-w-xs shadow-xl rounded-lg p-4 h-full">
        <div className="text-center">{label}</div>
        <Separator className="my-2" />
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <Badge
              key={`cf-${feature.id}`}
              className="transition-colors hover:bg-destructive cursor-pointer"
              onClick={() => onDelete(feature.label, feature.id)}
            >
              <div className="relative flex items-center justify-center">
                <span className={cn(isLoading && 'invisible')}>{feature.label}</span>
                <ImSpinner9 className={cn('absolute animate-spin', !isLoading && 'hidden')} />
              </div>
            </Badge>
          ))}
        </div>
      </div>
    </DropBox>
  );
};

export default CategoryBox;
