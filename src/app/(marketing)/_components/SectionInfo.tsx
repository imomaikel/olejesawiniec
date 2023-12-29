import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type TSectionInfo = {
  smallTitle: string;
  bigTitle: string;
  description?: string;
  buttonText?: string;
  className?: string;
  buttonLink?: string;
};
const SectionInfo = ({ bigTitle, smallTitle, buttonText, description, className, buttonLink }: TSectionInfo) => {
  return (
    <div className={cn('w-full flex flex-col justify-center relative z-10 items-start md:items-center', className)}>
      <div className=" relative z-10">
        <h3 className="text-primary tracking-wide font-normal mb-2">{smallTitle}</h3>
        <h2 className="text-4xl md:text-5xl font-bold whitespace-pre-wrap !leading-[65px]">{bigTitle}</h2>
      </div>
      {description && <p className="my-4 relative z-10 tracking-tight">{description}</p>}
      {buttonText && (
        <div className="max-w-sm mr-auto">
          <Button
            asChild={buttonLink ? true : false}
            className="rounded-full px-6 py-2 shadow-md shadow-primary w-[200px] relative z-10"
            size="2xl"
          >
            {buttonLink ? <Link href={buttonLink}>{buttonText}</Link> : buttonText}
          </Button>
        </div>
      )}
      <div className="bg-gradient-to-r from-yellow-200 via-green-200 to-green-500 absolute w-3/4 h-3/4 blur-[175px] md:blur-[115px] max-w-lg z-0" />
    </div>
  );
};

export default SectionInfo;
