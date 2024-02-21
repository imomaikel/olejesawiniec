import { trpc } from '@/components/providers/TRPC';
import { Badge } from '@/components/ui/badge';
import { cn, errorToast } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { ImSpinner9 } from 'react-icons/im';
import { toast } from 'sonner';

type TCustomFeature = {
  label: string;
  id: number;
  refetch: () => void;
};
const CustomFeature = ({ label, id, refetch }: TCustomFeature) => {
  const { mutate: removeCustomFeature, isLoading } = trpc.panel.removeCustomFeature.useMutation();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      type: 'feature',
      label,
      id,
    },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const onDelete = () => {
    if (isLoading) return;
    removeCustomFeature(
      {
        label,
      },
      {
        onSuccess: ({ error, message, success }) => {
          if (success) {
            toast.success(message);
            refetch();
          } else if (error) {
            errorToast();
          }
        },
        onError: () => errorToast(),
      },
    );
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="touch-none">
      <Badge className={cn('cursor-grab select-none', isLoading && 'bg-secondary')} onDoubleClick={onDelete}>
        <div className="relative flex items-center justify-center">
          <span className={cn(isLoading && 'invisible')}>{label}</span>
          <ImSpinner9 className={cn('absolute animate-spin', !isLoading && 'hidden')} />
        </div>
      </Badge>
    </div>
  );
};

export default CustomFeature;
