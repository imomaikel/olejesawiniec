'use client';
import { errorToast, successToast } from '@/lib/utils';
import { trpc } from '@/components/providers/TRPC';
import { IoOptions } from 'react-icons/io5';
import { Product } from '@prisma/client';
import RichEditor from '../RichEditor';
import { useState } from 'react';

type TProductDescription = {
  product: Product;
  refetch: () => void;
};
const ProductDescription = ({ product, refetch }: TProductDescription) => {
  const [description, setDescription] = useState(product.description ?? '');

  const { mutate: updateDescription, isLoading } = trpc.panel.updateDescription.useMutation({
    onSuccess: (data) => {
      data === true ? successToast('Opis zaktualizowany!') : errorToast();
      refetch();
    },
    onError: () => errorToast(),
  });

  const handleSave = (jsonData: string) => {
    updateDescription({ description: jsonData, productId: product.id });
  };

  return (
    <div className="flex flex-col">
      <div className="flex">
        <IoOptions className="w-6 h-6 mr-2" />
        <h2 className="font-medium text-lg">Opis produktu</h2>
      </div>

      <RichEditor onSave={handleSave} defaultValue={description} isDisabled={isLoading} />
    </div>
  );
};

export default ProductDescription;
