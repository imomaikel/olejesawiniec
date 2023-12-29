'use client';
import { errorToast, successToast } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/components/providers/TRPC';
import { Button } from '@/components/ui/button';
import { IoOptions } from 'react-icons/io5';
import { Product } from '@prisma/client';
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

  return (
    <div className="flex flex-col">
      <div className="flex">
        <IoOptions className="w-6 h-6 mr-2" />
        <h2 className="font-medium text-lg">Opis produktu</h2>
      </div>

      <Textarea
        disabled={isLoading}
        rows={10}
        placeholder="Wprowadź opis produktu..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button
        disabled={isLoading}
        className="max-w-sm mt-2 mx-auto"
        onClick={() => {
          updateDescription({
            description,
            productId: product.id,
          });
        }}
      >
        Aktualizuj
      </Button>
    </div>
  );
};

export default ProductDescription;
