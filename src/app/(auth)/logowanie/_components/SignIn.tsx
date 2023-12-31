'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Providers from './Providers';
import AuthForm from './AuthForm';

const SignIn = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logowanie</CardTitle>
        <CardDescription>Wpisz nazwę użytkownika oraz hasło lub zaloguj się za pomocą innych usług.</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm method="signIn" />
        <Providers />
      </CardContent>
    </Card>
  );
};

export default SignIn;
