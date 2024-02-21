'use client';
import { ElementRef, useEffect, useMemo, useRef, useState } from 'react';
import { cn, errorToast, formatPrice, successToast } from '@/lib/utils';
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Separator } from '@/components/ui/separator';
import { FaCartPlus, FaHeart } from 'react-icons/fa';
import { trpc } from '@/components/providers/TRPC';
import ImageSwiper from '@/components/ImageSwiper';
import { Button } from '@/components/ui/button';
import { Tag, Variant } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';
import { ImSpinner9 } from 'react-icons/im';
import VariantPicker from './VariantPicker';
import { useAnimate } from 'framer-motion';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';

const MAX_STARS = 6;
const OFFSET = 155;
const makeOffset = (val: number) => {
  if (val <= OFFSET) return 0;
  return val - OFFSET;
};

type TFloatingProduct = {
  productName: string;
  imageUrls: string[];
  tags?: Tag[];
  rating: number;
  ratingCount: number;
  link: string;
  variants: Variant[];
  onSelect: (variantId: string) => void;
};
const FloatingProduct = ({
  imageUrls,
  productName,
  tags,
  rating,
  ratingCount,
  link,
  variants,
  onSelect,
}: TFloatingProduct) => {
  const { addProduct: _addProduct, onOpen, cartData: _cartData } = useCart();
  const productRef = useRef<ElementRef<'div'>>(null);
  const floatBorder = useRef<null | number>(null);
  const [scope, animate] = useAnimate();
  const { update } = useSession();
  const user = useCurrentUser();

  const variantIds = user?.wishList ?? [];

  const firstVariant = useMemo(() => variants[0], [variants]);

  const [selectedVariant, setSelectedVariant] = useState({
    price: firstVariant.price,
    capacity: firstVariant.capacity,
    unit: firstVariant.unit,
    id: firstVariant.id,
  });

  useEffect(() => {
    const handleResize = () => {
      if (!productRef.current) return;
      const boxH = document.getElementById('productBox')?.clientHeight;
      if (!boxH) return;
      if (window.innerWidth < 1024) {
        productRef.current.style.transform = `translateY(0px)`;
      } else {
        floatBorder.current = boxH - productRef.current.clientHeight + OFFSET;
      }
    };
    handleResize();

    const handleScroll = () => {
      if (!productRef.current || !floatBorder.current) return;
      if (window.innerWidth < 1024) return;

      const minScreenHeight = productRef.current.clientHeight;
      if (minScreenHeight > document.body.clientHeight) {
        productRef.current.style.transform = `translateY(0px)`;
        return;
      }

      if (floatBorder.current > window.scrollY) {
        productRef.current.style.transform = `translateY(${makeOffset(window.scrollY)}px)`;
      }
      if (window.scrollY > floatBorder.current) {
        productRef.current.style.transform = `translateY(${makeOffset(floatBorder.current)}px)`;
      }
    };
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const { mutate: addToWishList } = trpc.shop.addToWishList.useMutation({
    onSuccess: ({ error, success }) => {
      if (error) {
        errorToast();
      } else if (success) {
        successToast('Dodano do listy życzeń!');
        update();
      }
    },
    onError: () => errorToast(),
  });

  const { mutate: serverAddToBasket } = trpc.basket.add.useMutation();

  const addToBasket = () => {
    if (!!user) {
      serverAddToBasket(
        { variantId: selectedVariant.id },
        {
          onSuccess: ({ message, error, success }) => {
            if (success) {
              toast.success(message);
              onOpen();
              refetch();
            } else if (error) {
              errorToast(message);
            }
          },
          onError: () => errorToast(),
        },
      );
    } else {
      verifyCartItem({ variantId: selectedVariant.id, currentQuantity });
    }
  };

  const { mutate: verifyCartItem, isLoading } = trpc.shop.verifyCartItem.useMutation({
    onSuccess: (response) => {
      if (response === true) {
        _addProduct({
          variant: {
            product: {
              mainPhoto: imageUrls[0] ?? null,
              label: productName,
              link,
            },
            capacity: selectedVariant.capacity,
            id: selectedVariant.id,
            price: selectedVariant.price,
            unit: selectedVariant.unit,
          },
          quantity: 1,
        });
        toast.success(`Dodano "${productName}" do koszyka!`);
        onOpen();
      } else {
        toast.error(response);
      }
    },
    onError: () => errorToast(),
  });

  const fullStars = rating >= MAX_STARS ? MAX_STARS : Math.floor(rating);
  const notFullStars = MAX_STARS - fullStars;

  let { data: cartData, refetch } = trpc.basket.get.useQuery(undefined, {
    enabled: !!user,
    retry: 1,
  });
  if (!!user === false) {
    cartData = _cartData;
  }
  if (!cartData) cartData = [];

  const currentQuantity = cartData.find((entry) => entry.variant.id === selectedVariant.id)?.quantity ?? 0;

  const changeVariant = (variant: Variant) => {
    setSelectedVariant({
      price: variant.price,
      capacity: variant.capacity,
      unit: variant.unit,
      id: variant.id,
    });
  };

  return (
    <div id="productBox" className="relative lg:max-w-sm w-full flex justify-center lg:block">
      <div id="product" ref={productRef} className="max-w-sm w-full">
        {/* Title */}
        <div className="mb-1">
          <h1 className="text-3xl font-bold">{productName}</h1>
        </div>
        {/* Feedback */}
        <div className="flex items-center mb-1">
          <div className="flex items-center mr-1">
            {[...Array.from(Array(fullStars).keys())].map((index) => (
              <IoStar key={`star-${index}`} className="text-orange-400" />
            ))}
            {[...Array.from(Array(notFullStars).keys())].map((index) => {
              if (rating - fullStars >= 0.5 && index == 0)
                return <IoStarHalf className="text-orange-400" key={`start-half-${index}`} />;
              return <IoStarOutline key={`star-empty-${index}`} className="opacity-75" />;
            })}
          </div>
          <p className="text-muted-foreground text-xs pt-1">na podstawie {ratingCount} ocen</p>
        </div>
        {/* Image */}
        <div>
          <ImageSwiper
            alt="olej"
            urls={imageUrls}
            fullSizeOnClick
            fitImage
            className="h-80 w-80 mx-auto 2xl:h-96 2xl:w-96 2xl:mx-0"
          />
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3 items-center justify-center">
          {tags && tags.map(({ label }) => <Badge key={label}>{label}</Badge>)}
        </div>
        <Separator className="my-4" />
        {/* Actions */}
        <div>
          <Button
            size="xl"
            className="w-full rounded-full font-bold transition-transform hover:scale-110 relative scale-100"
            onClick={addToBasket}
            disabled={isLoading}
            ref={scope}
          >
            <FaCartPlus className="h-8 w-8 mr-4" />
            <span>Dodaj do koszyka ({formatPrice(selectedVariant.price)})</span>
            <div className={cn('absolute right-4 hidden', isLoading && 'block')}>
              <ImSpinner9 className="w-6 h-6 animate-spin" />
            </div>
          </Button>
          <div className="flex flex-col justify-center items-center mb-3 mt-2">
            <p className="text-muted-foreground">Kliknij aby wybrać pojemność</p>
            <div className="grid grid-cols-3 gap-5">
              {variants.map((variant) => (
                <VariantPicker
                  isInWishList={variantIds.some((entry) => entry === variant.id)}
                  key={variant.id}
                  variant={variant}
                  onSelect={() => {
                    animate([
                      [scope.current, { transform: 'scale(110%)' }, { duration: 0.1 }],
                      [scope.current, { transform: 'scale(100%)' }, { duration: 0.1, delay: 0.1 }],
                    ]);
                    onSelect(variant.id);
                    changeVariant(variant);
                  }}
                  isSelected={selectedVariant.id === variant.id}
                />
              ))}
            </div>
          </div>
          <Button
            size="lg"
            className="w-full rounded-full font-bold"
            variant="pink"
            onClick={() => addToWishList({ variantId: selectedVariant.id })}
          >
            <FaHeart className="h-6 w-6 mr-4" />
            Dodaj do listy życzeń
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingProduct;
