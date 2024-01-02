'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'next/navigation';
import SignIn from './_components/SignIn';
import SignUp from './_components/SignUp';
import Error from './_components/Error';
import Image from 'next/image';

const AuthPage = () => {
  const searchParams = useSearchParams();

  const getMethod = searchParams.get('metoda');

  let method = 'signIn';

  if (getMethod === 'błąd') method = 'error';
  if (getMethod === 'nowe_konto') method = 'signUp';

  return (
    <div className="w-full md:h-screen flex items-center mt-16 md:mt-0 justify-start md:justify-center relative flex-col">
      <div className="relative w-[350px] md:w-[400px] flex justify-center">
        <Image src="/signatureBlack.png" width={300} height={120} alt="podpis" className="object-center" />
      </div>
      <p className="text-xs text-muted-foreground">Wybierz metodę</p>
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
    </div>
  );
};

export default AuthPage;
