import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { trpc } from '@/components/providers/TRPC';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { errorToast } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

type TAddOpinion = {
  cashbillId: string;
  originalProductId: string;
  refetch: () => void;
};

const AddOpinion = ({ cashbillId, originalProductId, refetch }: TAddOpinion) => {
  const [showAvatar, setShowAvatar] = useState(true);
  const [opinion, setOpinion] = useState('');

  const { mutate: addOpinion, isLoading } = trpc.shop.addOpinion.useMutation();
  const handleClick = () => {
    addOpinion(
      {
        cashbillId,
        opinion,
        originalProductId,
        showAvatar,
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
        onError: ({ data }) => errorToast(data?.zodErrorList),
      },
    );
  };

  return (
    <div className="py-3 flex flex-col items-center justify-center space-y-4">
      <p className="text-xl font-bold">Wystaw opinię</p>
      <div className="w-full">
        <Textarea
          className="resize-none"
          rows={5}
          placeholder="Napisz tutaj swoją opinię o produkcie..."
          disabled={isLoading}
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="showAvatar">Pokaż zdjęcie profilowe przy swojej opinii</Label>
        <Checkbox id="showAvatar" checked={showAvatar} onCheckedChange={() => setShowAvatar(!showAvatar)} />
      </div>
      <div className="w-full md:w-3/4">
        <Button className="w-full" onClick={handleClick}>
          Dodaj opinię
        </Button>
      </div>
    </div>
  );
};

export default AddOpinion;
