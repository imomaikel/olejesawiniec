import { IoCheckmarkCircle } from 'react-icons/io5';
import { cn, formatPrice } from '@/lib/utils';
import { FaHeart } from 'react-icons/fa';
import { Variant } from '@prisma/client';

type TVariantPicker = {
  variant: Variant;
  outOfStock?: boolean;
  lowStock?: boolean;
  isSelected?: boolean;
  isInWishList?: boolean;
  onSelect: () => void;
};
const VariantPicker = ({ variant, onSelect, outOfStock, lowStock, isSelected, isInWishList }: TVariantPicker) => {
  const { capacity, unit, price } = variant;

  return (
    <div
      onClick={onSelect}
      className={cn(
        'bg-primary rounded-md px-3 py-1 cursor-pointer hover:shadow-primary hover:shadow-lg transition-shadow shadow-lg group text-white relative text-sm',
        outOfStock && 'bg-destructive hover:shadow-destructive',
        lowStock && 'bg-orange-500 hover:shadow-orange-500',
      )}
    >
      <div className="group-hover:scale-110 transition-transform font-medium">
        {capacity}
        {unit}
      </div>
      <div className="tracking-wide font-medium">{formatPrice(price)}</div>
      <div className={cn('absolute -right-4 -top-2 text-black hidden', isSelected && 'block')}>
        <div className="relative">
          <IoCheckmarkCircle className="w-8 h-8 rotate-[15deg] absolute top-0 right-0 z-10" />
          <div className="absolute top-1 right-1 bg-primary w-6 h-6 rounded-full" />
        </div>
      </div>
      {isInWishList && (
        <div className="absolute -right-3 bottom-4">
          <FaHeart className="w-6 h-6 rotate-[15deg] absolute top-0 right-0 z-10 text-rose-600" />
        </div>
      )}
    </div>
  );
};

export default VariantPicker;
