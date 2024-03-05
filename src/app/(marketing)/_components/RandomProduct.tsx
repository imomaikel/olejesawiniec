'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { trpc } from '@/components/providers/TRPC';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RiseLoader } from 'react-spinners';
import Link from 'next/link';

type TRandomProduct = {
  isOpen: boolean;
  onClose: () => void;
};
const RandomProduct = ({ isOpen, onClose }: TRandomProduct) => {
  const {
    data: product,
    isLoading,
    isRefetching,
    refetch,
  } = trpc.shop.getRandomProduct.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {isLoading || !product ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ładowanie produktu</DialogTitle>
            <DialogDescription>Za chwilę pojawią się tutaj właściwości produktu.</DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <RiseLoader color="#16a34a" />
          </div>
          <div className="w-full h-full absolute inset-0 bg-gradient-to-l from-green-200 to-green-500 opacity-20 -z-10" />
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{product.label}</DialogTitle>
            <DialogDescription>
              Został przedstawiony jeden z produktów dostępnych w naszym sklepie. Używając przycisku poniżej możesz
              podejrzeć inny produkt.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <p className="font-semibold tracking-wide">Właściwości</p>
              <ul className="list-disc ml-6 leading-6">
                {product.details.map((entry) => (
                  <li key={entry.id}>{entry.content}</li>
                ))}
              </ul>
            </div>
            {product.tags.length >= 1 && (
              <div>
                <p className="font-semibold tracking-wide">Dodatkowo</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((entry) => (
                    <Badge key={entry.id}>{entry.label}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="w-full h-full absolute inset-0 bg-gradient-to-l from-green-200 to-green-500 opacity-20 -z-10" />
          <DialogFooter>
            <Button asChild variant="link">
              <Link href={`/sklep/${product.link}`}>Zobacz produkt</Link>
            </Button>
            <Button onClick={() => refetch()} disabled={isLoading || isRefetching}>
              Zmień produkt
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default RandomProduct;
