import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type TAddOpinion = {
  cashbillId: string;
};

const AddOpinion = ({ cashbillId }: TAddOpinion) => {
  return (
    <div className="py-3 flex flex-col items-center justify-center space-y-4">
      <div className="w-full">
        <Textarea className="resize-none" rows={5} />
      </div>
      <div className="w-full md:w-3/4">
        <Button className="w-full">Dodaj opinię</Button>
      </div>
    </div>
  );
};

export default AddOpinion;
