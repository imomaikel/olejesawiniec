'use server';
import VerifyButton from './components/VerifyButton';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { signIn } from '@/auth';

const AccountVerificationPage = async ({ params }: { params: { userToken: string } }) => {
  const { userToken } = params;

  const token = await prisma.verificationToken.findUnique({
    where: {
      token: userToken,
    },
  });

  if (!token) {
    redirect('/sklep');
  }

  const handleClick = async () => {
    'use server';
    await prisma.user.update({
      where: { email: token.email },
      data: { forceLogin: true },
    });
    await signIn('credentials', {
      email: token.email,
      password: process.env.FORCE_AUTH_PASS,
      redirectTo: '/sklep',
    });
    await prisma.user.update({
      where: { email: token.email },
      data: { forceLogin: false, emailVerified: new Date() },
    });
    await prisma.verificationToken.delete({
      where: { token: userToken },
    });
  };

  const now = new Date().getTime();
  if (token.expires.getTime() < now) {
    await prisma.verificationToken.delete({
      where: {
        token: userToken,
      },
    });
    return (
      <div>
        <h1 className="font-bold text-4xl">Potwierdzenie rejestracji konta</h1>
        <p className="text-muted-foreground">Link weryfikacyjny wygasł. Prosimy o ponowne założenie konta.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-bold text-4xl">Potwierdzenie rejestracji konta</h1>
      <p className="text-muted-foreground">Aby dokończyć proces rejestracji prosimy o naciśnięcie przycisku poniżej</p>

      <VerifyButton action={handleClick} />
    </div>
  );
};

export default AccountVerificationPage;
