import { FaRegStar, FaStar } from 'react-icons/fa6';
import { MAX_STARS, errorToast } from '@/lib/utils';
import { trpc } from '@/components/providers/TRPC';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { toast } from 'sonner';

type TAddRating = {
  cashbillId: string;
  originalProductId: string;
  refetch: () => void;
};
const AddRating = ({ cashbillId, originalProductId, refetch }: TAddRating) => {
  const [rating, setRating] = useState(MAX_STARS);

  const starsList = Array.from(Array(MAX_STARS).keys());

  const { mutate: addRating, isLoading } = trpc.shop.addRating.useMutation();

  const handleClick = () => {
    addRating(
      {
        cashbillId,
        rating,
        originalProductId,
      },
      {
        onSuccess: ({ error, message, success }) => {
          if (error) {
            return errorToast(message);
          }
          if (success) {
            refetch();
            return toast.success(message);
          }
        },
        onError: () => errorToast(),
      },
    );
  };

  return (
    <div className="py-3 flex flex-col items-center justify-center space-y-4">
      <p className="text-xl font-bold">Wystaw ocenę</p>
      <div className="flex flex-wrap gap-2">
        {starsList.map((index) => (
          <div
            key={`${cashbillId}-empty-${++index}`}
            className="cursor-pointer"
            role="button"
            aria-label="zmień liczbę gwiazdek"
            onClick={() => setRating(index)}
          >
            {rating > index ? <FaStar className="h-8 w-8 text-primary" /> : <FaRegStar className="h-8 w-8" />}
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground !my-1">Kliknij, na gwiazdkę aby zmienić ocenę.</p>
      <div className="w-full md:w-3/4">
        <Button className="space-x-2 w-full" onClick={handleClick} disabled={isLoading}>
          <span className="font-medium">Dodaj ocenę</span>
          <Badge variant="secondary">
            {rating} na {MAX_STARS} gwiazdek
          </Badge>
        </Button>
      </div>
    </div>
  );
};

export default AddRating;
