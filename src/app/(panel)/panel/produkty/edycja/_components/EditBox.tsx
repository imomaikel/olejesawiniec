'use client';
import { cn, errorToast, formatPrice, successToast } from '@/lib/utils';
import ProductStatus from '../../../_components/ProductStatus';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import { Separator } from '@/components/ui/separator';
import ActionButton from '@/components/ActionButton';
import { ElementRef, useRef, useState } from 'react';
import { trpc } from '@/components/providers/TRPC';
import { Product, Variant } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import Link from 'next/link';

type TEditBox = {
  product: Product & {
    variants: Variant[];
  };
  refetchProduct: () => void;
};
const EditBox = ({ product, refetchProduct }: TEditBox) => {
  const [selectedVariant, setSelectedVariant] = useState<{
    id: string;
    stock: number;
    price: number;
  } | null>(null);

  const ref = useRef<ElementRef<'input'>>(null);

  const productStatus = product.enabled ? 'enabled' : 'disabled';
  const isOutOfStock = !product.variants.some((variant) => variant.stock > 0);

  const { mutate: changeState, isLoading } = trpc.panel.productState.useMutation({
    onSuccess: (data) => {
      data === true ? successToast('Zmieniono status produktu!') : errorToast();
      refetchProduct();
    },
    onError: () => errorToast(),
  });

  const { mutate: updateVariant, isLoading: isUpdating } = trpc.panel.updateVariant.useMutation({
    onSuccess: (data) => {
      data === true ? successToast('Zaktualizowano!') : errorToast();
      refetchProduct();
    },
    onError: () => errorToast(),
  });

  return (
    <div className="py-1 px-2 md:py-2 md:px-4 rounded-md bg-gray-100 flex min-h-[128px]">
      <div className="flex items-center">
        {product.mainPhoto ? (
          <Image src={product.mainPhoto} height={64} width={64} alt={product.label} />
        ) : (
          <MdOutlineImageNotSupported className="h-16 w-16" />
        )}
      </div>
      <Separator orientation="vertical" className="mx-2 md:mx-4" />
      <div className="flex flex-col">
        <div className="flex items-center lg:flex-row flex-col space-y-2 lg:space-y-0">
          <h3 className="mr-6 font-bold text-lg">{product.label}</h3>
          <div className="lg:space-x-2 flex lg:flex-row flex-col space-y-2 lg:space-y-0">
            <ProductStatus status={productStatus} />
            {isOutOfStock && <ProductStatus status="out of stock" />}
            <div>
              {productStatus === 'enabled' ? (
                <ActionButton
                  size="sm"
                  variant="warning"
                  onClick={() => changeState({ newState: false, productId: product.id })}
                  disabled={isLoading}
                >
                  Wyłącz produkt
                </ActionButton>
              ) : (
                <ActionButton
                  size="sm"
                  onClick={() => changeState({ newState: true, productId: product.id })}
                  disabled={isLoading}
                >
                  Włącz produkt
                </ActionButton>
              )}
            </div>
            <Button asChild variant="link" size="sm">
              <Link href={`/panel/produkty/${product.link}`}>Edytuj szczegóły</Link>
            </Button>
            {product.enabled && (
              <Button asChild variant="link" size="sm">
                <Link href={product.link} target="_blank">
                  Zobacz produkt
                </Link>
              </Button>
            )}
          </div>
        </div>
        <p className="text-muted-foreground text-xs mb-0.5 mt-2">Kliknij na pojemność aby edytować</p>
        <div className="flex lg:divide-x-2 divide-gray-300 mb-2 flex-col lg:flex-row flex-wrap">
          {product.variants.map((variant) => (
            <div
              key={variant.id}
              className={cn(
                'px-2 flex space-x-2 hover:underline cursor-pointer',
                selectedVariant?.id === variant.id && 'text-primary',
              )}
              onClick={() => {
                if (selectedVariant?.id === variant.id) {
                  return setSelectedVariant(null);
                }
                setSelectedVariant({
                  id: variant.id,
                  price: variant.price,
                  stock: variant.stock,
                });
                ref.current?.focus();
              }}
            >
              <div>
                {variant.capacity}
                {variant.unit}
              </div>
              <div />
              {variant.stock}szt
              <div />
              {formatPrice(variant.price)}
            </div>
          ))}
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-2">
          <div>
            <Label htmlFor="productPrice">Cena</Label>
            <Input
              ref={ref}
              id="productPrice"
              type="number"
              disabled={!selectedVariant || isUpdating}
              value={selectedVariant?.price ?? ''}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value);
                if (selectedVariant) {
                  setSelectedVariant({ ...selectedVariant, price: newValue });
                }
              }}
            />
          </div>
          <div>
            <Label htmlFor="productStock">Stan Magazynowy</Label>
            <Input
              id="productStock"
              type="number"
              disabled={!selectedVariant || isUpdating}
              value={selectedVariant?.stock ?? ''}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value);
                if (selectedVariant) {
                  setSelectedVariant({ ...selectedVariant, stock: newValue });
                }
              }}
            />
          </div>
          <div className="flex items-end">
            <Button
              disabled={!selectedVariant || isUpdating}
              className="w-full mt-2 md:mt-0 md:w-auto"
              onClick={() =>
                selectedVariant?.id &&
                updateVariant({
                  price: selectedVariant?.price ?? 0,
                  stock: selectedVariant?.stock ?? 0,
                  variantId: selectedVariant?.id,
                })
              }
            >
              Aktualizuj
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBox;
