'use client';
import { trpc } from '@/components/providers/TRPC';
import { Input } from '@/components/ui/input';
import EditBox from './_components/EditBox';
import { useState } from 'react';

const EditPage = () => {
  const [filter, setFilter] = useState('');
  const { data: products, isLoading } = trpc.panel.getAllProducts.useQuery(undefined, { refetchOnWindowFocus: false });

  const { mutate: refetchProduct } = trpc.panel.refetchProduct.useMutation({
    onSuccess: (data) => {
      if (!data) return;

      const target = products?.find((entry) => entry.id === data.id);
      if (!target) return;

      target.variants = data.variants;
      target.enabled = data.enabled;
    },
  });

  const updateProduct = (productId: string) => {
    refetchProduct({ productId });
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div>
        <h1 className="text-xl font-bold">Szybka edycja</h1>
      </div>
      <div>
        <h1 className="text-xl font-bold">Znajdź produkt</h1>
        <p className="text-muted-foreground">Wpisz nazwę aby wyszukać</p>
        <Input
          className="max-w-xs w-full"
          placeholder="Nazwa"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-y-4">
        {products
          ?.filter(({ label }) =>
            label.replace(/ /gi, '').toLowerCase().includes(filter.replace(/ /gi, '').toLowerCase()),
          )
          .map((product) => (
            <EditBox key={product.id} product={product} refetchProduct={() => updateProduct(product.id)} />
          ))}
      </div>
    </div>
  );
};

export default EditPage;
