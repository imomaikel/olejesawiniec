'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SignUpSchema, TSignUpSchema } from '@/lib/validators/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@/components/ui/checkbox';
import FormSuccess from '@/components/FormSuccess';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { signUpUser } from '@/lib/authenticate';
import FormError from '@/components/FormError';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { fbPixel } from '@/lib/pixel';
import Link from 'next/link';

const SignUpForm = () => {
  const [isLoading, setIsStransition] = useTransition();
  const form = useForm<TSignUpSchema>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      acceptRules: false,
    },
  });
  const [success, setSuccess] = useState<null | string>();
  const [error, setError] = useState<null | string>();

  const onSubmit = ({ email, password, firstName, acceptRules }: TSignUpSchema) => {
    setSuccess('');
    setError('');

    setIsStransition(() => {
      signUpUser({ email, password, firstName, acceptRules })
        .then((response) => {
          if (response.error) {
            setError(response.error);
          }
          if (response.success) {
            fbPixel('CompleteRegistration');
            setSuccess(
              'Twoje konto zostało pomyślnie założone. Wysłaliśmy do Ciebie e-maila z prośbą o weryfikację konta. Prosimy o sprawdzenie skrzynki odbiorczej i potwierdzenie swoich danych.',
            );
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
          <FormField
            control={form.control}
            name="acceptRules"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regulamin</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    <span className="text-sm">
                      Zaakceptuj{' '}
                      <Link href="/regulamin" className="underline">
                        regulamin
                      </Link>
                      , aby zalożyć konto.
                    </span>
                  </div>
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
