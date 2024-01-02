'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SignInSchema, TSignInSchema } from '@/lib/validators/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/components/providers/TRPC';
import FormSuccess from '@/components/FormSuccess';
import { Button } from '@/components/ui/button';
import FormError from '@/components/FormError';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

const SignInForm = () => {
  const form = useForm<TSignInSchema>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: signIn, isLoading, data: signInResponse } = trpc.auth.signIn.useMutation();

  const onSubmit = ({ email, password }: TSignInSchema) => signIn({ email, password });

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
        {signInResponse?.error && <FormError description={signInResponse.error} />}
        {signInResponse?.success && <FormSuccess description="Sukces!" />}
      </form>
    </Form>
  );
};

export default SignInForm;
