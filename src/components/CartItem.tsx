'use client';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { TBasketVariantSchema } from '@/lib/validators/order';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import { useCurrentUser } from '@/hooks/use-current-user';
import { errorToast, formatPrice } from '@/lib/utils';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { BsCartDash } from 'react-icons/bs';
import { useCart } from '@/hooks/use-cart';
import { trpc } from './providers/TRPC';
import { BsDot } from 'react-icons/bs';
import { fbPixel } from '@/lib/pixel';
import { Button } from './ui/button';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import Hover from './Hover';

const CartItem = ({
  quantity,
  variant,
  features,
}: TBasketVariantSchema & {
  features: {
    id: number;
    label: string;
  }[];
}) => {
  const user = useCurrentUser();
  const {
    removeProduct: _removeProduct,
    increaseQuantity: _increaseQuantity,
    decreaseQuantity: _decreaseQuantity,
    cartData: _cartData,
    customFeatureMenuOnOpen,
  } = useCart();

  const { mutate: serverAddToBasket, isLoading: isAdding } = trpc.basket.add.useMutation();
  const { mutate: serverRemoveFromBasket, isLoading: isRemoving } = trpc.basket.remove.useMutation();
  const { mutate: serverSetProductQuantity, isLoading: isUpdating } = trpc.basket.setQuantity.useMutation();

  const addToBasket = () => {
    if (!!user) {
      serverAddToBasket(
        { variantId: variantId },
        {
          onSuccess: ({ message, error, success }) => {
            if (success) {
              fbPixel('AddToCart');
              toast.success(message);
              refetch();
            } else if (error) {
              errorToast(message);
            }
          },
          onError: () => errorToast(),
        },
      );
    } else {
      if (!isLoading && currentQuantity && currentQuantity >= 1) verifyIncrease({ variantId, currentQuantity });
    }
  };
  const removeOneFromBasket = () => {
    if (!!user) {
      serverRemoveFromBasket(
        { variantId: variantId },
        {
          onSuccess: ({ message, error, success }) => {
            if (success) {
              toast.success(message);
              refetch();
            } else if (error) {
              errorToast(message);
            }
          },
          onError: () => errorToast(),
        },
      );
    } else {
      if (!isLoading) {
        _decreaseQuantity(variantId);
      }
    }
  };
  const removeProductFromBasket = () => {
    if (!!user) {
      serverSetProductQuantity(
        { variantId: variantId, newQuantity: 0 },
        {
          onSuccess: ({ message, error, success }) => {
            if (success) {
              toast.success(message);
              refetch();
            } else if (error) {
              errorToast(message);
            }
          },
          onError: () => errorToast(),
        },
      );
    } else {
      if (!isLoading) {
        _removeProduct(variantId);
      }
    }
  };

  const { mutate: verifyIncrease, isLoading } = trpc.shop.verifyCartItem.useMutation({
    onSuccess: (response) => {
      if (response === true) {
        fbPixel('AddToCart');
        _increaseQuantity(variant.id);
      } else {
        toast.error(response);
      }
    },
    onError: () => errorToast(),
  });

  let { data: cartData, refetch } = trpc.basket.get.useQuery(undefined, {
    enabled: !!user,
    retry: 1,
  });
  if (!!user === false) {
    cartData = _cartData;
  }
  if (!cartData) cartData = [];

  const currentQuantity = cartData.find((entry) => entry.variant.id === variant.id)?.quantity;

  const image = variant.product?.mainPhoto;
  const productLabel = variant.product?.label;
  const productLink = variant.product?.link;
  const variantCapacity = variant.capacity;
  const variantUnit = variant.unit;
  const variantPrice = variant.price;
  const variantId = variant.id;

  const isApiLoading = isUpdating || isAdding || isRemoving;

  return (
    <div className="flex bg-gray-100 rounded-md relative space-x-3 pr-12 shadow-xl border hover:border-primary transition-colors">
      <div className="flex items-center justify-center overflow-hidden">
        {image ? (
          <Image src={image} width={128} height={128} alt="produkt" className="rounded-tl-md rounded-bl-md" />
        ) : (
          <div className="flex items-center justify-center flex-col px-2 text-center">
            <MdOutlineImageNotSupported className="w-16 h-16" />
            <span className="text-xs">Brak zdjęcia</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 items-center py-2">
        <div className="flex flex-col">
          <span className="text-lg font-medium">{productLabel}</span>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>
              {variantCapacity}
              {variantUnit}
            </span>
            <BsDot className="w-4 h-4 mb-1" />
            <span>{formatPrice(variantPrice)}/szt.</span>
          </div>
          <div className="text-muted-foreground text-sm flex items-center space-x-2 mb-2">
            <span>{quantity} szt.</span>
            <Hover content="Dodaj jedną sztukę">
              <Button
                className="transition-colors hover:text-primary cursor-pointer"
                onClick={addToBasket}
                disabled={isApiLoading}
                size="xsIcon"
                variant="outline"
                aria-label="dodaj jedną sztuke"
              >
                <AiOutlinePlus className="mb-1 w-5 h-5" />
              </Button>
            </Hover>
            <Hover content="Usuń jedną sztukę">
              <Button
                className="transition-colors hover:text-primary cursor-pointer"
                aria-label="usuń jedną sztuke"
                size="xsIcon"
                variant="outline"
                onClick={removeOneFromBasket}
                disabled={isApiLoading}
              >
                <AiOutlineMinus className="mb-1 w-5 h-5" />
              </Button>
            </Hover>
          </div>
          <div className="select-none space-y-2">
            <Button asChild size="sm" className="w-full">
              <Link href={`/sklep/${productLink}` ?? '/sklep'}>
                Zobacz produkt
                <FaExternalLinkAlt className="ml-1 h-3 w-3 mb-1" />
              </Link>
            </Button>
            {/* TODO Custom Features Support */}
            {/* {features.length >= 1 && (
              <Button size="sm" className="w-full" onClick={() => customFeatureMenuOnOpen(variant.id)}>
                Personalizuj
              </Button>
            )} */}
          </div>
        </div>
      </div>
      <Hover content="Usuń z koszyka">
        <div
          className="bg-destructive/75 absolute right-0 top-0 h-full w-10 flex items-center justify-center rounded-tr-md rounded-br-md transition-colors hover:bg-destructive cursor-pointer"
          onClick={() => {
            if (!isApiLoading) removeProductFromBasket();
          }}
        >
          <BsCartDash className="h-6 w-6" />
        </div>
      </Hover>
    </div>
  );
};

export default CartItem;
