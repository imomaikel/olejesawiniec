import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignIn from './_components/SignIn';
import SignUp from './_components/SignUp';
import Image from 'next/image';

const AuthPage = () => {
  return (
    <div className="w-full md:h-screen flex items-center mt-16 md:mt-0 justify-start md:justify-center relative flex-col">
      <div className="relative w-[350px] md:w-[400px] flex justify-center">
        <Image src="/signatureBlack.png" width={300} height={120} alt="podpis" className="object-center" />
      </div>
      <p className="text-xs text-muted-foreground">Wybierz metodę</p>
      <Tabs defaultValue="signIn" className="w-[350px] md:w-[400px]">
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
      </Tabs>
    </div>
  );
};

export default AuthPage;
