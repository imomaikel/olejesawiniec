import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { shopRouter } from '@/server/routers/shopRouter';
import { inferRouterOutputs } from '@trpc/server';
import { formatPrice } from '@/lib/utils';
import AddOpinion from './AddOpinion';
import AddRating from './AddRating';
import React from 'react';

type TReviewProduct = {
  cashbillId: string;
  product: inferRouterOutputs<typeof shopRouter>['getProductsToReview'][0]['products'][0] | null;
  onClose: () => void;
  refetch: () => void;
};
const ReviewProduct = ({ cashbillId, product, onClose, refetch }: TReviewProduct) => {
  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-h-[75%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product?.productName || ''}</DialogTitle>
          <DialogDescription>Zapraszamy do oceny zakupionego produktu.</DialogDescription>
        </DialogHeader>
        <div className="divide-y-2">
          <div className="pb-3">
            <p className="text-muted-foreground">Zakupione pojemności</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lp.</TableHead>
                  <TableHead>Pojemność</TableHead>
                  <TableHead>Ilość</TableHead>
                  <TableHead>Cena / szt.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product?.variants.map((variant, index) => (
                  <TableRow key={`${variant.capacity}${cashbillId}`}>
                    <TableCell>{++index}</TableCell>
                    <TableCell>
                      {variant.capacity}
                      {variant.unit}
                    </TableCell>
                    <TableCell>{variant.quantity}</TableCell>
                    <TableCell>{formatPrice(variant.price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {product?.isRating === false && (
            <AddRating cashbillId={cashbillId} originalProductId={product.originalProductId} refetch={refetch} />
          )}
          {product?.isOpinion === false && <AddOpinion cashbillId={cashbillId} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewProduct;
