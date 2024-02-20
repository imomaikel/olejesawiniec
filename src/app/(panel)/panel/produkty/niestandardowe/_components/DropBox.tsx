import { cn } from '@/lib/utils';
import { useDrop } from 'react-dnd';

type TDropBox = {
  children: React.ReactNode;
  onDrop: (label: string, id: number) => void;
};
const DropBox = ({ children, onDrop }: TDropBox) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'feature',
    drop: (item: any) => onDrop(item.label, item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={cn(
        'transition-colors border max-w-xs w-full rounded-lg',
        canDrop && 'border-primary',
        isOver && 'bg-emerald-300/50',
      )}
    >
      {children}
    </div>
  );
};

export default DropBox;
