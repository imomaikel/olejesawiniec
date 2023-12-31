'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Providers from './Providers';
import AuthForm from './AuthForm';

const SignUp = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rejestracja</CardTitle>
        <CardDescription>
          Wpisz nazwę użytkownika oraz hasło aby utworzyć konto lub zarejestruj się za pomocą innych usług.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm method="signUp" />
        <Providers />
      </CardContent>
    </Card>
  );
};

export default SignUp;
