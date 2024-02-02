import { trpc } from '@/components/providers/TRPC';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { errorToast, formatPrice, successToast } from '@/lib/utils';
import { Product, Variant } from '@prisma/client';
import { FaTrashAlt } from 'react-icons/fa';

type TVariantList = {
  product: Product & {
    variants: Variant[];
  };
  refetchProduct: () => void;
};
const VariantList = ({ product, refetchProduct }: TVariantList) => {
  const { mutate: removeVariant, isLoading: removeLoading } = trpc.panel.removeVariant.useMutation({
    onSuccess: (message) => {
      successToast(message);
      refetchProduct();
    },
    onError: () => errorToast(),
  });

  return (
    <>
      <h3 className="mt-4 font-medium">Aktualne opcje</h3>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pojemność</TableHead>
              <TableHead>Cena</TableHead>
              <TableHead>Stan magazynowy</TableHead>
              <TableHead>Usuń</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product.variants.map((variant) => {
              const { capacity, id, price, stock, unit } = variant;

              return (
                <TableRow key={id}>
                  <TableCell>
                    {capacity}
                    {unit}
                  </TableCell>
                  <TableCell>{formatPrice(price)}</TableCell>
                  <TableCell>{stock}</TableCell>
                  <TableCell>
                    <div
                      role="button"
                      aria-label="usuń wariant"
                      onClick={() => {
                        if (removeLoading) return;
                        removeVariant({
                          capacityUnit: `${capacity}${unit}`,
                          productId: product.id,
                          variantId: id,
                        });
                      }}
                    >
                      <FaTrashAlt className="w-4 h-4 cursor-pointer hover:text-destructive transition-colors" />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default VariantList;
