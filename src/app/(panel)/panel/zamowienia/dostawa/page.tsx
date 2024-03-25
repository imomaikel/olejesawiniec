'use client';
import ShippingConfigForm from './_components/ShippingConfigForm';
import { trpc } from '@/components/providers/TRPC';

const ShippingConfigPage = () => {
  const { data: shopConfig, isLoading } = trpc.shop.getShippingConfig.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div>
        <h1 className="text-xl font-bold">Konfiguracja płatności za dostawę</h1>
      </div>
      <div>
        {isLoading ? (
          <p>Ładowanie</p>
        ) : shopConfig?.success ? (
          <ShippingConfigForm data={shopConfig.data} />
        ) : (
          <p>Wystąpił błąd</p>
        )}
      </div>
    </div>
  );
};

export default ShippingConfigPage;
