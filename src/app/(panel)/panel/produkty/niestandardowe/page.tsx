'use client';
import { ElementRef, useMemo, useRef, useState } from 'react';
import CustomFeature from './_components/CustomFeature';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CategoryBox from './_components/CategoryBox';
import { trpc } from '@/components/providers/TRPC';
import ProductBox from './_components/ProductBox';
import { Button } from '@/components/ui/button';
import { useEventListener } from 'usehooks-ts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { errorToast } from '@/lib/utils';
import { DndProvider } from 'react-dnd';
import { toast } from 'sonner';

const CustomProductFeaturePage = () => {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const ref = useRef<ElementRef<'input'>>(null);
  const [newLabel, setNewLabel] = useState('');

  const { data: features, isLoading: isFetching1, refetch } = trpc.panel.getCustomFeatues.useQuery();
  const { mutate: createCustomFeature, isLoading: isCreating } = trpc.panel.createCustomFeature.useMutation();

  const { data: products, isLoading: isFetching2, refetch: refetchProducts } = trpc.panel.getAllProducts.useQuery();
  const {
    data: categories,
    isLoading: isFetching3,
    refetch: refetchCategories,
  } = trpc.panel.getAllCategories.useQuery();

  const onAddNew = () => {
    createCustomFeature(
      { label: newLabel },
      {
        onSuccess: ({ error, message, success }) => {
          if (success) {
            toast.success(message);
            setNewLabel('');
            setTimeout(() => {
              ref.current?.focus();
              ref.current?.select();
            });
            refetch();
          } else if (error) {
            errorToast();
          }
        },
        onError: () => errorToast(),
      },
    );
  };

  const onKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      onAddNew();
    }
  };
  useEventListener('keypress', onKeyPress);

  const filteredCategories = useMemo(
    () => categories?.filter((entry) => entry.label.toLowerCase().includes(categoryFilter)) ?? [],
    [categoryFilter, categories],
  );
  const filteredProducts = useMemo(
    () => products?.filter((entry) => entry.label.toLowerCase().includes(productFilter)) ?? [],
    [productFilter, products],
  );

  if (isFetching1 || isFetching2 || isFetching3) return null;
  const featureList: number[] = features?.map((entry) => entry.id) ?? [];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col space-y-4 w-full">
        <div>
          <h1 className="text-xl font-bold">Niestandardowe właściwości</h1>
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Aktualne właściwości</h2>
            <p className="text-muted-foreground">Kliknij na właściwość podwójnie aby usunąć</p>
            <div className="flex gap-2 flex-wrap w-full">
              {features &&
                features.map((feature) => (
                  <CustomFeature key={feature.id} label={feature.label} id={feature.id} refetch={refetch} />
                ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Dodaj nową właściwość</h2>
            <div className="flex space-x-2 max-w-md">
              <Input disabled={isCreating} value={newLabel} onChange={(e) => setNewLabel(e.target.value)} ref={ref} />
              <Button disabled={isCreating} onClick={onAddNew}>
                Dodaj
              </Button>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Dodaj do kategorii lub produktu</h2>
            <p className="text-muted-foreground max-w-xl text-justify text-sm">
              Jeżeli dodasz właściwość do kategorii, każdy produkt z tej kategorii będzie miał opcję dodania tej
              właściwości. Jeśli tego nie chcesz, dodaj właściwość do jednego lub więcej produktu, bez dodawania do
              kategorii.
            </p>
            <p className="text-muted-foreground">Aby dodać właściwość, złap i przeciągnij ją na dane miejsce.</p>
            <div className="mt-2">
              <div>
                <div>Kategorie</div>
                <div>
                  <Label htmlFor="category">Wyszukaj kategorie</Label>
                  <Input
                    className="max-w-sm"
                    id="category"
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                  />
                </div>
                <div className="my-4 flex flex-wrap gap-4">
                  {filteredCategories.map((category) => (
                    <CategoryBox
                      key={category.id}
                      id={category.id}
                      label={category.label}
                      features={category.customFeatures}
                      allFeatures={featureList}
                      refetch={refetchCategories}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div>Produkty</div>
                <div>
                  <Label htmlFor="product">Wyszukaj produkt</Label>
                  <Input
                    className="max-w-sm"
                    id="product"
                    value={productFilter}
                    onChange={(event) => setProductFilter(event.target.value)}
                  />
                </div>
                <div className="my-4 flex flex-wrap gap-4">
                  {filteredProducts.map((product) => (
                    <ProductBox
                      key={product.id}
                      id={product.id}
                      label={product.label}
                      features={product.customFeatures}
                      allFeatures={featureList}
                      refetch={refetchProducts}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default CustomProductFeaturePage;
