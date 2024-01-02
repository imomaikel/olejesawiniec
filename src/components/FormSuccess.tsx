import { Alert, AlertDescription } from '@/components/ui/alert';
import { IoMdCheckmarkCircle } from 'react-icons/io';

type TFormSuccess = {
  description: string;
};
const FormSuccess = ({ description }: TFormSuccess) => {
  return (
    <Alert variant="success" className="my-2 flex space-x-2 items-center">
      <div>
        <IoMdCheckmarkCircle className="h-8 w-8" />
      </div>
      <AlertDescription className="font-semibold">{description}</AlertDescription>
    </Alert>
  );
};

export default FormSuccess;
