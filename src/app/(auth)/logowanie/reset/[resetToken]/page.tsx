'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordResetSchema, TPasswordResetSchema } from '@/lib/validators/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { forgottenPasswordSetNew } from '@/lib/authenticate';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import FormError from '@/components/FormError';
import { Input } from '@/components/ui/input';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

const PasswordResetPage = () => {
  const { resetToken } = useParams<{ resetToken: string }>();
  const [success, setSuccess] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const form = useForm<TPasswordResetSchema>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      password: '',
      retypePassword: '',
    },
  });

  const onSubmit = ({ password, retypePassword }: TPasswordResetSchema) => {
    setError('');
    setSuccess(false);
    startTransition(() => {
      forgottenPasswordSetNew(password, retypePassword, resetToken)
        .then(({ error, message, success }) => {
          if (error) {
            setError(message);
            return;
          } else if (success) {
            setSuccess(true);
          }
        })
        .catch(() => setError('Wystąpił błąd.'));
    });
  };

  return (
    <Card className="w-[350px] md:w-[400px]">
      <CardHeader>
        <div>
          <CardTitle>Resetowanie hasła</CardTitle>
        </div>
        <div>
          <CardDescription className="mb-[20px] md:mb-0">Wpisz poniżej swoje nowe hasło.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nowe hasło</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Wpisz tutaj swoje nowe hasło"
                        {...field}
                        disabled={isPending || success}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="retypePassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Powtórz hasło</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Powtórz wyżej napisane hasło"
                        {...field}
                        disabled={isPending || success}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              {error && <FormError description={error} />}
              {success && (
                <Alert variant="success" className="mt-4 flex space-x-2 items-center">
                  <div>
                    <IoMdCheckmarkCircle className="h-8 w-8" />
                  </div>
                  <AlertDescription className="font-semibold">
                    <p className="text-center">
                      Hasło zostało zmienione. Kliknij poniżej aby zalogować się z nowo ustawionym hasłem.
                    </p>
                    <Button asChild className="mt-1 w-full">
                      <Link href="/logowanie">Zaloguj się</Link>
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </div>
            {!success && (
              <Button type="submit" size="lg" className="w-full rounded-full mt-4" disabled={isPending}>
                Ustaw nowe hasło
              </Button>
            )}
            <Button variant="secondary" asChild className="w-full rounded-full mt-4">
              <Link href="/logowanie">Powrót do logowania</Link>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PasswordResetPage;
