import { FaRegStar, FaStar } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MAX_STARS } from '@/lib/utils';
import { useState } from 'react';

type TAddRating = {
  cashbillId: string;
};
const AddRating = ({ cashbillId }: TAddRating) => {
  const [rating, setRating] = useState(MAX_STARS);

  const starsList = Array.from(Array(MAX_STARS).keys());

  return (
    <div className="py-3 flex flex-col items-center justify-center space-y-4">
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
      <div className="w-full md:w-3/4">
        <Button className="space-x-2 w-full">
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
