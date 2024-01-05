'use client';
import { cn, errorToast, formatPrice, successToast } from '@/lib/utils';
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { useCart } from '@/hooks/use-cart';
import { useAnimate } from 'framer-motion';
import { toast } from 'sonner';

const MAX_STARS = 6;

type TFloatingProduct = {
  productName: string;
  imageUrls: string[];
  tags?: Tag[];
  rating: number;
  ratingCount: number;
  link: string;
  variants: Variant[];
};
const FloatingProduct = ({ imageUrls, productName, tags, rating, ratingCount, link, variants }: TFloatingProduct) => {
  const { addProduct, onOpen, cartData } = useCart();
  const scrollMax = useRef<null | number>(null);
  const [scrollY, setScrollY] = useState(0);
  const [scope, animate] = useAnimate();
  const user = useCurrentUser();
  const { update } = useSession();

  const variantIds = user?.wishList ?? [];

  const firstVariant = useMemo(() => variants[0], [variants]);

  const [selectedVariant, setSelectedVariant] = useState({
    price: firstVariant.price,
    capacity: firstVariant.capacity,
    unit: firstVariant.unit,
    id: firstVariant.id,
  });

  useEffect(() => {
    const handleScroll = () => {
      const productBoxBottom = document.getElementById('productBox')?.getBoundingClientRect().bottom;
      const productBottom = document.getElementById('product')?.getBoundingClientRect().bottom;
      if (!productBottom || !productBoxBottom) return;

      const diff = productBoxBottom - productBottom;

      if (diff > 0 || (scrollMax.current && scrollMax.current > window.scrollY)) {
        setScrollY(window.scrollY);
      } else {
        if (scrollMax.current === null) {
          scrollMax.current = window.scrollY - Math.abs(diff);
        }
        if (diff <= -1) {
          setScrollY(scrollMax.current);
        }
      }
    };
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollY]);

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

  const { mutate: verifyCartItem, isLoading } = trpc.shop.verifyCartItem.useMutation({
    onSuccess: (response) => {
      if (response === true) {
        addProduct({
          image: imageUrls[0] ?? null,
          productLabel: productName,
          quantity: 1,
          variantPrice: selectedVariant.price,
          productLink: link,
          variantCapacity: selectedVariant.capacity,
          variantId: selectedVariant.id,
          variantUnit: selectedVariant.unit,
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

  const currentQuantity = cartData.find((entry) => entry.variantId === selectedVariant.id)?.quantity ?? 0;

  const changeVariant = (variant: Variant) => {
    setSelectedVariant({
      price: variant.price,
      capacity: variant.capacity,
      unit: variant.unit,
      id: variant.id,
    });
  };

  return (
    <div id="productBox" className="max-w-sm w-full relative">
      <div id="product" style={{ transform: `translateY(${scrollY}px)` }}>
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
          <ImageSwiper alt="olej" urls={imageUrls} fullSizeOnClick fitImage />
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
            onClick={() => verifyCartItem({ variantId: selectedVariant.id, currentQuantity })}
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
