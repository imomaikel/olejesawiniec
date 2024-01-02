import { Alert, AlertDescription } from '@/components/ui/alert';
import { MdOutlineError } from 'react-icons/md';
import { motion } from 'framer-motion';

type TFormError = {
  description: string;
};
const FormError = ({ description }: TFormError) => {
  return (
    <motion.div
      initial={{
        x: 100,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
    >
      <Alert variant="destructive" className="my-2 flex space-x-2 items-center">
        <div>
          <MdOutlineError className="h-8 w-8" />
        </div>
        <AlertDescription className="font-semibold">{description}</AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default FormError;
