'use client';
import { confirmNewsletter } from '@/lib/newsletter';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { errorToast } from '@/lib/utils';
import { useTransition } from 'react';
import { toast } from 'sonner';

type TConfirmButton = {
  token: string;
};
const ConfirmButton = ({ token }: TConfirmButton) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleConfirm = () => {
    startTransition(() => {
      confirmNewsletter(token)
        .then(({ error, message }) => {
          if (error) return errorToast(message);
          toast.success("Potwierdzono zapis do Newsletter'a!");
          router.replace('/sklep');
        })
        .catch(() => errorToast());
    });
  };

  return (
    <Button className="mt-6 max-w-md w-full" onClick={handleConfirm} disabled={isPending}>
      Potwierdź rejestrację
    </Button>
  );
};

export default ConfirmButton;
