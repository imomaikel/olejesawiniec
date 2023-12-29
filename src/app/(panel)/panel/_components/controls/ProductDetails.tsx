import { Product, ProductDetail } from '@prisma/client';
import { errorToast, successToast } from '@/lib/utils';
import { trpc } from '@/components/providers/TRPC';
import { Button } from '@/components/ui/button';
import { TiChevronRight } from 'react-icons/ti';
import { Input } from '@/components/ui/input';
import { FaTrashAlt } from 'react-icons/fa';
import { IoOptions } from 'react-icons/io5';
import { useState } from 'react';

type TProductDetails = {
  product: Product & {
    details: ProductDetail[];
  };
  refetch: () => void;
};
const ProductDetails = ({ product, refetch }: TProductDetails) => {
  const [detail, setDetail] = useState('');

  const { mutate: addDetail, isLoading } = trpc.panel.addDetail.useMutation({
    onSuccess: (data) => {
      data === true ? successToast('Dodano!') : errorToast();
      refetch();
    },
    onError: () => errorToast,
  });

  const { mutate: removeDetail, isLoading: isDeleting } = trpc.panel.removeDetail.useMutation({
    onSuccess: (data) => {
      data === true ? successToast('Usunięto!') : errorToast();
      refetch();
    },
    onError: () => errorToast,
  });

  return (
    <div>
      <div className="flex">
        <IoOptions className="w-6 h-6 mr-2" />
        <h2 className="font-medium text-lg">Właściwości produktu</h2>
      </div>
      <h3 className="mt-4 font-medium">Aktualne właściwości</h3>
      <ul className="ml-6 space-y-2">
        {product.details.length >= 1 ? (
          product.details.map((detail) => (
            <li className="flex items-center" key={detail.id}>
              <TiChevronRight className="w-6 h-6" />
              <span>{detail.content}</span>
              <div onClick={() => !isDeleting && removeDetail({ detailId: detail.id })}>
                <FaTrashAlt className="w-5 h-5 cursor-pointer transition-colors hover:text-destructive ml-4" />
              </div>
            </li>
          ))
        ) : (
          <li>Brak dodanych właściwości</li>
        )}
      </ul>
      <div>
        <h3 className="mt-4 font-medium">Dodaj nową właściwość</h3>
        <div className="flex items-center space-x-2">
          <Input disabled={isLoading} value={detail} onChange={(e) => setDetail(e.target.value)} />
          <Button
            disabled={isLoading}
            onClick={() =>
              addDetail({
                detail,
                productId: product.id,
              })
            }
          >
            Dodaj
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
