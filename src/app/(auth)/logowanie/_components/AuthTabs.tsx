'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'next/navigation';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Error from './Error';

const AuthTabs = () => {
  const searchParams = useSearchParams();

  const getMethod = searchParams.get('metoda');

  let method = 'signIn';

  if (getMethod === 'błąd') method = 'error';
  if (getMethod === 'nowe_konto') method = 'signUp';

  return (
    <Tabs defaultValue={method} className="w-[350px] md:w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signIn">Logowanie</TabsTrigger>
        <TabsTrigger value="signUp">Rejestracja</TabsTrigger>
      </TabsList>
      <TabsContent value="signIn">
        <SignIn />
      </TabsContent>
      <TabsContent value="signUp">
        <SignUp />
      </TabsContent>
      <TabsContent value="error">
        <Error />
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;
