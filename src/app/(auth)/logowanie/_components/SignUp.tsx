'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import SignUpForm from './SignUpForm';
import Providers from './Providers';
import { useEffect } from 'react';

const SignUp = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const redirectTo = searchParams.get('powrót');

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    params.set('metoda', 'nowe_konto');
    router.replace(`${pathname}?${params}`);
  }, [pathname, router, searchParams]);

  return (
    <Card>
      <CardHeader>
        <motion.div
          initial={{
            x: 100,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          viewport={{ once: false }}
        >
          <CardTitle>Rejestracja</CardTitle>
        </motion.div>
        <motion.div
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          viewport={{ once: false }}
        >
          <CardDescription>
            Wpisz nazwę użytkownika oraz hasło aby utworzyć konto lub zarejestruj się za pomocą innych usług.
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent>
        <SignUpForm redirectTo={redirectTo} />
        <Providers redirectTo={redirectTo} />
      </CardContent>
    </Card>
  );
};

export default SignUp;
