'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

type TChartWrapper = {
  title: string;
  children: React.ReactElement;
  className?: string;
};
const ChartWrapper = ({ title, children, className }: TChartWrapper) => {
  return (
    <div className={cn('flex flex-col h-72 px-2 shadow-md border rounded-lg pt-4', className)}>
      <h1 className="mx-auto text-xl md:text-2xl font-bold tracking-wide">{title}</h1>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
};

ChartWrapper.Skeleton = function ShowSkeleton() {
  return (
    <div className="flex flex-col h-72 px-2 shadow-md border rounded-lg pt-4">
      <Skeleton className="w-3/4 h-8 mx-auto mb-2" />
      <ResponsiveContainer width="100%" height="100%">
        <Skeleton className="w-full h-full" />
      </ResponsiveContainer>
    </div>
  );
};

export default ChartWrapper;
