import { Alert, AlertDescription } from '@/components/ui/alert';
import { MdOutlineError } from 'react-icons/md';

type TFormError = {
  description: string;
};
const FormError = ({ description }: TFormError) => {
  return (
    <Alert variant="destructive" className="my-2 flex space-x-2 items-center">
      <div>
        <MdOutlineError className="h-8 w-8" />
      </div>
      <AlertDescription className="font-semibold">{description}</AlertDescription>
    </Alert>
  );
};

export default FormError;
