'use client';
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';
import { cn, errorToast, formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { FaCartPlus, FaHeart } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { trpc } from '@/components/providers/TRPC';
import ImageSwiper from '@/components/ImageSwiper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImSpinner9 } from 'react-icons/im';
import { useCart } from '@/hooks/use-cart';
import { Tag } from '@prisma/client';
import { toast } from 'sonner';

const MAX_STARS = 6;

type TFloatingProduct = {
  productName: string;
  imageUrls: string[];
  tags?: Tag[];
  selectedPrice: number;
  rating: number;
  ratingCount: number;
  link: string;
  variantCapacity: number;
  variantId: string;
  variantUnit: string;
};
const FloatingProduct = ({
  imageUrls,
  productName,
  tags,
  selectedPrice,
  rating,
  ratingCount,
  link,
  variantCapacity,
  variantId,
  variantUnit,
}: TFloatingProduct) => {
  const scrollMax = useRef<null | number>(null);
  const [scrollY, setScrollY] = useState(0);
  const { addProduct, onOpen, cartData } = useCart();

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

  const { mutate: verifyCartItem, isLoading } = trpc.verifyCartItem.useMutation({
    onSuccess: (response) => {
      if (response === true) {
        addProduct({
          image: imageUrls[0] ?? null,
          productLabel: productName,
          quantity: 1,
          variantPrice: selectedPrice,
          productLink: link,
          variantCapacity,
          variantId,
          variantUnit,
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

  const currentQuantity = cartData.find((entry) => entry.variantId === variantId)?.quantity ?? 0;

  return (
    <div id="productBox" className="max-w-sm relative">
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
        <div className="space-y-3">
          <Button
            size="xl"
            className="w-full rounded-full font-bold transition-transform hover:scale-110 relative"
            onClick={() => verifyCartItem({ variantId, currentQuantity })}
            disabled={isLoading}
          >
            <FaCartPlus className="h-8 w-8 mr-4" />
            <span>Dodaj do koszyka ({formatPrice(selectedPrice)})</span>
            <div className={cn('absolute right-4 hidden', isLoading && 'block')}>
              <ImSpinner9 className="w-6 h-6 animate-spin" />
            </div>
          </Button>
          <Button size="lg" className="w-full rounded-full font-bold" variant="pink">
            <FaHeart className="h-6 w-6 mr-4" />
            Dodaj do listy życzeń
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingProduct;
