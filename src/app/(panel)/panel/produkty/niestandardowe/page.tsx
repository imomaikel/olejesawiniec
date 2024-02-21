'use client';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import CustomFeature from './_components/CustomFeature';
import DroppableBox from './_components/DroppableBox';
import { ElementRef, useRef, useState } from 'react';
import { trpc } from '@/components/providers/TRPC';
import { inferRouterOutputs } from '@trpc/server';
import { AppRouter } from '@/server/routers/_app';
import { Button } from '@/components/ui/button';
import { useEventListener } from 'usehooks-ts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { errorToast } from '@/lib/utils';
import { toast } from 'sonner';

type TPanelRouterOutput = inferRouterOutputs<AppRouter['panel']>;
type TProducts = TPanelRouterOutput['getAllProducts'];
type TCategories = TPanelRouterOutput['getAllCategories'];

const CustomProductFeaturePage = () => {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const ref = useRef<ElementRef<'input'>>(null);
  const [newLabel, setNewLabel] = useState('');

  const [products, setProducts] = useState<TProducts>();
  const [categories, setCategories] = useState<TCategories>();

  const {
    data: features,
    isLoading: featuresLoading,
    refetch: refetchFeatues,
  } = trpc.panel.getCustomFeatues.useQuery();
  const { mutate: createCustomFeature, isLoading: isFeatureCreating } = trpc.panel.createCustomFeature.useMutation();

  const { isLoading: productsLoading, refetch: refetchProducts } = trpc.panel.getAllProducts.useQuery(undefined, {
    onSuccess: (data) => setProducts(data),
  });
  const { isLoading: categoriesLoading, refetch: refetchCategories } = trpc.panel.getAllCategories.useQuery(undefined, {
    onSuccess: (data) => setCategories(data),
  });

  const addNewFeature = () => {
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
            refetchFeatues();
          } else if (error) {
            errorToast();
          }
        },
        onError: () => errorToast(),
      },
    );
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      addNewFeature();
    }
  };
  useEventListener('keypress', handleKeyPress);

  const { mutate: addCustomFeatureToProduct } = trpc.panel.addCustomFeatureToProduct.useMutation();
  const { mutate: removeCustomFeatureFromProduct } = trpc.panel.removeCustomFeatureFromProduct.useMutation();

  const { mutate: addCustomFeatureToCategory } = trpc.panel.addCustomFeatureToCategory.useMutation();
  const { mutate: removeCustomFeatureFromCategory } = trpc.panel.removeCustomFeatureFromCategory.useMutation();

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over?.id) return;

    const target = event.over.id.toString().split('-');
    const targetMode = target[0] as 'CATEGORY' | 'PRODUCT';
    const targetId = target[1];

    const feature = event.active.data.current as any;
    const featureId = feature.id as number;
    const featureLabel = feature.label as string;

    if (targetMode === 'CATEGORY') {
      if (
        categories
          ?.find((category) => category.id === targetId)
          ?.customFeatures.some((feature) => feature.id === featureId)
      ) {
        return toast.info(`"${featureLabel}" już istnieje`);
      }
      addCustomFeatureToCategory(
        { categoryId: targetId, label: featureLabel },
        {
          onError: () => errorToast(),
          onSuccess: ({ error, message, success }) => {
            if (success) {
              toast.success(message);
            } else if (error) {
              errorToast();
              refetchCategories();
            }
          },
        },
      );
      setCategories(
        categories?.map((category) => {
          if (category.id !== targetId) return category;
          return {
            ...category,
            customFeatures: [
              ...category.customFeatures,
              {
                id: featureId,
                label: featureLabel,
              },
            ],
          };
        }),
      );
    } else if (targetMode === 'PRODUCT') {
      if (
        products?.find((product) => product.id === targetId)?.customFeatures.some((feature) => feature.id === featureId)
      ) {
        return toast.info(`"${featureLabel}" już istnieje`);
      }
      addCustomFeatureToProduct(
        { productId: targetId, label: featureLabel },
        {
          onError: () => errorToast(),
          onSuccess: ({ error, message, success }) => {
            if (success) {
              toast.success(message);
            } else if (error) {
              errorToast();
              refetchProducts();
            }
          },
        },
      );
      setProducts(
        products?.map((product) => {
          if (product.id !== targetId) return product;
          return {
            ...product,
            customFeatures: [
              ...product.customFeatures,
              {
                id: featureId,
                label: featureLabel,
              },
            ],
          };
        }),
      );
    }
  };

  const handleFeatureDelete = (featureLabel: string, targetId: string, mode: 'CATEGORY' | 'PRODUCT') => {
    if (mode === 'CATEGORY') {
      removeCustomFeatureFromCategory(
        { categoryId: targetId, label: featureLabel },
        {
          onError: () => errorToast(),
          onSuccess: ({ error, message, success }) => {
            if (success) {
              toast.success(message);
            } else if (error) {
              errorToast();
              refetchCategories();
            }
          },
        },
      );
      setCategories(
        categories?.map((category) => {
          if (category.id !== targetId) return category;
          return {
            ...category,
            customFeatures: category.customFeatures.filter((feature) => feature.label !== featureLabel),
          };
        }),
      );
    } else if (mode === 'PRODUCT') {
      removeCustomFeatureFromProduct(
        { productId: targetId, label: featureLabel },
        {
          onError: () => errorToast(),
          onSuccess: ({ error, message, success }) => {
            if (success) {
              toast.success(message);
            } else if (error) {
              errorToast();
              refetchProducts();
            }
          },
        },
      );
      setProducts(
        products?.map((product) => {
          if (product.id !== targetId) return product;
          return {
            ...product,
            customFeatures: product.customFeatures.filter((feature) => feature.label !== featureLabel),
          };
        }),
      );
    }
  };

  if (productsLoading || categoriesLoading || featuresLoading) return null;

  return (
    <DndContext onDragEnd={handleDragEnd}>
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
                  <CustomFeature key={feature.id} label={feature.label} id={feature.id} refetch={refetchFeatues} />
                ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Dodaj nową właściwość</h2>
            <div className="flex space-x-2 max-w-md">
              <Input
                disabled={isFeatureCreating}
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                ref={ref}
              />
              <Button disabled={isFeatureCreating} onClick={addNewFeature}>
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
                  {categories?.map((category) => (
                    <DroppableBox
                      key={category.id}
                      id={category.id}
                      mode="CATEGORY"
                      label={category.label}
                      features={category.customFeatures}
                      onFeatureDelete={(featureLabel) => handleFeatureDelete(featureLabel, category.id, 'CATEGORY')}
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
                  {products?.map((product) => (
                    <DroppableBox
                      key={product.id}
                      id={product.id}
                      mode="PRODUCT"
                      label={product.label}
                      features={product.customFeatures}
                      onFeatureDelete={(featureLabel) => handleFeatureDelete(featureLabel, product.id, 'PRODUCT')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default CustomProductFeaturePage;
