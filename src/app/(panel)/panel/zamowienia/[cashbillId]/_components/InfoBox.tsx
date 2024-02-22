import { HiClipboardCopy } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { useAnimate } from 'framer-motion';
import { toast } from 'sonner';

type TInfoBox = {
  title: string;
  content: React.ReactNode | string;
  raw?: string;
};
const InfoBox = ({ title, content, raw }: TInfoBox) => {
  const [scope, animate] = useAnimate();
  const isCustom = typeof content !== 'string';

  const handleClick = () => {
    const toCopy = isCustom ? raw : content;
    if (toCopy) {
      animate('button', { scale: [1.1, 1] }, { duration: 0.15 });
      animate('span', { x: [-10, 10, 0] }, { duration: 0.25, type: 'tween' });
      window.navigator.clipboard.writeText(toCopy);
      toast.info('Skopiowano!');
    } else {
      toast.error('Nie udało się skopiować.');
    }
  };

  return (
    <div>
      <p className="text-sm font-medium leading-none">{title}</p>
      <div className="flex items-center mt-0.5" ref={scope}>
        <div className="flex h-9 w-fit rounded-tl-md rounded-bl-md border px-4 items-center py-1 text-sm shadow-sm border-r-0">
          <span>{content}</span>
        </div>
        <Button size="icon" onClick={handleClick} className="rounded-tl-none rounded-bl-none">
          <HiClipboardCopy />
        </Button>
      </div>
    </div>
  );
};

export default InfoBox;
