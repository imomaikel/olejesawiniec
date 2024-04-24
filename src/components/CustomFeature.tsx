'use client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCurrentUser } from '@/hooks/use-current-user';
import { RiseLoader } from 'react-spinners';
import { useCart } from '@/hooks/use-cart';
import { trpc } from './providers/TRPC';
import Feature from './Feature';

const CustomFeature = () => {
  const {
    isCustomFeatureMenuOpen,
    customFeatureMenuOnOpenChange,
    customFeatureVariantId,
    cartData: clientCartData,
  } = useCart();
  const user = useCurrentUser();

  const { data, isLoading } = trpc.shop.getCustomFeatures.useQuery(
    { variantId: customFeatureVariantId || '' },
    {
      enabled: !!customFeatureVariantId && customFeatureVariantId.length >= 3,
    },
  );
  const { data: serverCartData } = trpc.basket.get.useQuery(undefined, {
    enabled: !!user,
    retry: 1,
  });

  const cartData = serverCartData || clientCartData;

  const cartVariant = cartData?.find((entry) => entry.variant.id === customFeatureVariantId);

  // TODO
  if (!cartData || !cartVariant) return null;
  // if (!cartData || !cartVariant) return 'Nie znaleziono koszyka.';

  return (
    <Dialog open={isCustomFeatureMenuOpen} onOpenChange={customFeatureMenuOnOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Personalizacja</DialogTitle>
          {!isLoading && data?.productLabel && <DialogDescription>{data?.productLabel}</DialogDescription>}
        </DialogHeader>
        <div>
          {isLoading ? (
            <div className="w-full flex items-center justify-center my-6">
              <RiseLoader />
            </div>
          ) : (
            <div>
              <p>
                Ilość sztuk w koszyku: <span>{cartVariant.quantity}</span>
              </p>
              <div>
                <p>Możliwe personalizacje:</p>

                <div className="space-y-2">
                  {data?.features.map((feature) => {
                    return (
                      <Feature
                        key={feature.id}
                        id={feature.id}
                        totalQuantity={cartVariant.quantity}
                        label={feature.label}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomFeature;

// TODO Facebook pixel CustomizeProduct
