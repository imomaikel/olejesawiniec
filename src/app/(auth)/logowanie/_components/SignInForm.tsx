'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SignInSchema, TSignInSchema } from '@/lib/validators/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import FormSuccess from '@/components/FormSuccess';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { signInUser } from '@/lib/authenticate';
import FormError from '@/components/FormError';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

type TSignInForm = {
  redirectTo: string | null;
};
const SignInForm = ({ redirectTo }: TSignInForm) => {
  const [isLoading, setIsStransition] = useTransition();
  const form = useForm<TSignInSchema>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      password: '',
      email: '',
    },
  });
  const [success, setSuccess] = useState<null | string>();
  const [error, setError] = useState<null | string>();
  const onSubmit = ({ email, password }: TSignInSchema) => {
    setSuccess('');
    setError('');

    setIsStransition(() => {
      signInUser({ email, password }, redirectTo)
        .then((response) => {
          if (response?.error) {
            setError(response.error);
          } else {
            // TODO
            setSuccess('Suckes!');
          }
        })
        .catch(() => setError('Wystąpił błąd!'));
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adres e-mail</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Wpisz tutaj swój adres e-mail" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hasło</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Wpisz tutaj swoje hasło" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <motion.div
          animate={{
            x: [10, -10, 0],
          }}
          transition={{
            duration: 0.35,
            stiffness: 30,
          }}
          viewport={{ once: false }}
        >
          <Button type="submit" size="lg" className="w-full rounded-full mt-4" disabled={isLoading}>
            Zaloguj się
          </Button>
        </motion.div>
        {error && <FormError description={error} />}
        {success && <FormSuccess description={success} />}
      </form>
    </Form>
  );
};

export default SignInForm;
