'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { afterVerification } from '@/lib/authenticate';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const CheckVerification = () => {
  const params = useSearchParams();
  const session = useSession();
  const router = useRouter();

  const isVerified = params.get('weryfikacja');

  useEffect(() => {
    console.log(session);
    if (isVerified === 'sukces') {
      toast.success('Konto zostało zweryfikowane!');
      router.replace('/sklep');
      afterVerification();
      // session.update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerified]);

  return null;
};

export default CheckVerification;
