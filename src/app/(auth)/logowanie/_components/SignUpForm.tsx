'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SignUpSchema, TSignUpSchema } from '@/lib/validators/auth';
import { signInUser, signUpUser } from '@/lib/authenticate';
import { zodResolver } from '@hookform/resolvers/zod';
import FormSuccess from '@/components/FormSuccess';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import FormError from '@/components/FormError';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

type TSignUpForm = {
  redirectTo: string | null;
};
const SignUpForm = ({ redirectTo }: TSignUpForm) => {
  const [isLoading, setIsStransition] = useTransition();
  const form = useForm<TSignUpSchema>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
    },
  });
  const [success, setSuccess] = useState<null | string>();
  const [error, setError] = useState<null | string>();

  const onSubmit = ({ email, password, firstName }: TSignUpSchema) => {
    setSuccess('');
    setError('');

    setIsStransition(() => {
      signUpUser({ email, password, firstName })
        .then((response) => {
          if (response.error) {
            setError(response.error);
          }
          if (response.success) {
            setSuccess(response.success);
            signInUser({ email, password }, redirectTo);
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
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Wpisz tutaj swoje imię" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            Załóż konto
          </Button>
        </motion.div>
        {error && <FormError description={error} />}
        {success && <FormSuccess description={success} />}
      </form>
    </Form>
  );
};

export default SignUpForm;
