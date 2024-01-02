'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AuthValidator, TAuthValidator } from '@/lib/validators/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/components/providers/TRPC';
import FormSuccess from '@/components/FormSuccess';
import { Button } from '@/components/ui/button';
import FormError from '@/components/FormError';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

type TAuthForm = {
  method: 'signIn' | 'signUp';
};
const AuthForm = ({ method }: TAuthForm) => {
  const form = useForm<TAuthValidator>({
    resolver: zodResolver(AuthValidator),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: signUp, isLoading, data: signUpResponse } = trpc.auth.signUp.useMutation();

  const onSubmit = ({ email, password }: TAuthValidator) => signUp({ email, password });

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
            {method === 'signIn' ? 'Zaloguj się' : 'Załóż konto'}
          </Button>
        </motion.div>
        <FormSuccess description="Konto założone" />
        {signUpResponse?.error && <FormError description={signUpResponse.error} />}
        {signUpResponse?.success && <FormSuccess description={signUpResponse.success} />}
      </form>
    </Form>
  );
};

export default AuthForm;
