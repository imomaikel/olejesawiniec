'use client';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import ChartWrapper from './_components/ChartWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/components/providers/TRPC';
import { formatPrice } from '@/lib/utils';

const PanelSummaryPage = () => {
  const { data, isLoading } = trpc.panel.getStatistics.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (isLoading) return <PanelSummaryPage.Skeleton />;
  if (!data) return 'Wystąpił błąd';

  const { earningsThisMonth, ordersThisMonth, usersThisMonth, yearlyEarnings } = data;

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4">
      <ChartWrapper title="Zamówienia w tym miesiącu">
        <LineChart data={ordersThisMonth}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="label" />
          <YAxis width={30} className="text-xs" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} name="Zamówienia" />
        </LineChart>
      </ChartWrapper>
      <ChartWrapper title="Nowi klienci w tym miesiącu">
        <LineChart data={usersThisMonth}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="label" />
          <YAxis width={30} className="text-xs" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} name="Nowi klienci" />
        </LineChart>
      </ChartWrapper>
      <ChartWrapper title="Zarobki w tym miesiącu">
        <LineChart data={earningsThisMonth}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="label" />
          <YAxis width={30} className="text-xs" />
          <Tooltip formatter={(val) => formatPrice(parseFloat(val.toString()))} />
          <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} name="Zarobki" />
        </LineChart>
      </ChartWrapper>
      <ChartWrapper title="Zarobki roczne">
        <LineChart data={yearlyEarnings}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="label" className="text-sm" />
          <YAxis width={30} className="text-xs" />
          <Tooltip formatter={(val) => formatPrice(parseFloat(val.toString()))} />
          <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} name="Zarobki" />
        </LineChart>
      </ChartWrapper>
    </div>
  );
};
PanelSummaryPage.Skeleton = function ShowSkeleton() {
  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Skeleton className="h-[288px]" />
      <Skeleton className="h-[288px]" />
      <Skeleton className="h-[288px]" />
      <Skeleton className="h-[288px]" />
    </div>
  );
};

export default PanelSummaryPage;
