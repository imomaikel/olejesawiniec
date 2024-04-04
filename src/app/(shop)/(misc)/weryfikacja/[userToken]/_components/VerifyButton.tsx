'use client';
import { Button } from '@/components/ui/button';

type TVerifyButton = {
  action: () => void;
};
const VerifyButton = ({ action }: TVerifyButton) => {
  return (
    <form action={action}>
      <Button className="mt-6 max-w-md w-full" type="submit">
        Potwierdź rejestrację
      </Button>
    </form>
  );
};

export default VerifyButton;
