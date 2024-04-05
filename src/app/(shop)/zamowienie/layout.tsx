'use server';
import { Button } from '@/components/ui/button';
import { auth } from '@/auth';
import Link from 'next/link';

const OrderLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session || !session.user.email) {
    return (
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold">
          Aby złożyć zamówienie, konieczne jest zalogowanie się lub utworzenie konta.
        </h1>
        <p className="text-muted-foreground">
          W ten sposób otrzymasz dodatkowo możliwość oceniania zakupionych produktów, przeglądania historii zamówień
          oraz korzystania z innych funkcji.
        </p>
        <Button asChild className="w-full mt-2" size="lg">
          <Link href="/logowanie?powrót=/zamowienie">Logowanie</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};

export default OrderLayout;
