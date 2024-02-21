import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

type TDroppableBox = {
  mode: 'PRODUCT' | 'CATEGORY';
  id: string;
  label: string;
  className?: string;
  features: {
    id: number;
    label: string;
  }[];
  onFeatureDelete: (featureLabel: string) => void;
};
const DroppableBox = ({ id, mode, className, label, features, onFeatureDelete }: TDroppableBox) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id: `${mode}-${id}`,
    data: {
      accepts: ['feature'],
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'transition-all max-w-xs w-full rounded-lg border shadow-lg',
        className,
        active && 'border-primary',
        isOver && 'bg-primary/25 scale-105',
      )}
    >
      <div className="p-4 flex flex-col items-center space-y-2">
        <div>{label}</div>
        <Separator />
        <div className="flex justify-start w-full flex-wrap gap-2">
          {features.map((feature) => (
            <Badge
              key={`cf-${feature.id}`}
              className="transition-colors hover:bg-destructive cursor-pointer"
              onClick={() => onFeatureDelete(feature.label)}
            >
              {feature.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DroppableBox;
