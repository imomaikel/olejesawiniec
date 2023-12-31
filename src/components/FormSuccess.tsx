import { Alert, AlertDescription } from '@/components/ui/alert';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { motion } from 'framer-motion';

type TFormSuccess = {
  description: string;
};
const FormSuccess = ({ description }: TFormSuccess) => {
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
      <Alert variant="success" className="my-2 flex space-x-2 items-center">
        <div>
          <IoMdCheckmarkCircle className="h-8 w-8" />
        </div>
        <AlertDescription className="font-semibold">{description}</AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default FormSuccess;
