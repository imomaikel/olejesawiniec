'use client';
import ProductDescription from './controls/ProductDescription';
import ProductManager from './controls/ProductManager';
import NutritionTable from './controls/NutritionTable';
import ProductDetails from './controls/ProductDetails';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/components/providers/TRPC';
import PhotoManager from './controls/PhotoManager';
import VariantList from './controls/VariantList';
import TagControl from './controls/TagControl';
import NewVariant from './controls/NewVariant';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { IoOptions } from 'react-icons/io5';
import { errorToast } from '@/lib/utils';

type TProductEditor = {
  productLink: string;
};
const ProductEditor = ({ productLink }: TProductEditor) => {
  const router = useRouter();

  const {
    data: product,
    isLoading: isProductLoading,
    refetch: _refetchProduct,
  } = trpc.panel.getProductInfo.useQuery(
    { productLink },
    {
      onSuccess: (data) => {
        if (!data) {
          errorToast('Nie znaleziono produktu!');
          router.push('/panel/produkty');
        }
      },
      onError: () => {
        errorToast();
        router.push('/panel/produkty');
      },
      refetchOnWindowFocus: false,
    },
  );

  const {
    data: tags,
    isLoading: isTagLoading,
    refetch: _refetchTags,
  } = trpc.getTagList.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const refetchProduct = () => _refetchProduct();
  const refetchTags = () => _refetchTags();

  if (isProductLoading || isTagLoading || !product || !tags) {
    return 'Loading...';
  }

  return (
    <>
      {/* Product name */}
      <div>
        <div className="flex mb-1">
          <IoOptions className="w-6 h-6 mr-2" />
          <h2 className="font-medium text-lg">Nazwa produktu</h2>
        </div>
        <Input value={product.label} disabled />
      </div>
      {/* Product name */}
      <div>
        <div className="flex mb-1">
          <IoOptions className="w-6 h-6 mr-2" />
          <h2 className="font-medium text-lg">Kategoria produktu</h2>
        </div>
        <Input value={product.category.label} disabled />
      </div>

      <Separator />

      {/* Product Controls */}
      <ProductManager product={product} refetch={refetchProduct} />

      <Separator />

      {/* Product tags */}
      <TagControl
        allTags={tags}
        productTags={product.tags}
        productId={product.id}
        refetchTag={refetchTags}
        refetchProduct={refetchProduct}
      />

      <Separator />

      {/* Product variants */}
      <div>
        <div className="flex">
          <IoOptions className="w-6 h-6 mr-2" />
          <h2 className="font-medium text-lg">Opcje produktu</h2>
        </div>
        <VariantList refetchProduct={refetchProduct} product={product} />
        <NewVariant productId={product.id} refetchProduct={refetchProduct} />
      </div>

      <Separator />

      {/* Product images */}
      <PhotoManager product={product} refetch={refetchProduct} />

      <Separator />

      {/* Product details  */}
      <ProductDetails product={product} refetch={refetchProduct} />

      <Separator />

      {/* Product description */}
      <ProductDescription product={product} refetch={refetchProduct} />

      <Separator />

      {/* Product nutrition facts */}
      <NutritionTable product={product} refetch={refetchProduct} />
    </>
  );
};

export default ProductEditor;
