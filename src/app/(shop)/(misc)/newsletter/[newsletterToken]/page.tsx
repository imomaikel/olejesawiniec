'use server';
import ConfirmButton from './components/ConfirmButton';
import { redirect } from 'next/navigation';
import { addDays } from 'date-fns';
import prisma from '@/lib/prisma';

const NewsletterConfirmationPage = async ({ params }: { params: { newsletterToken: string } }) => {
  const { newsletterToken } = params;

  const token = await prisma.newsletter.findUnique({
    where: {
      token: newsletterToken,
      verified: false,
    },
  });

  if (!token) {
    redirect('/sklep');
  }

  const now = new Date().getTime();
  const expiryDate = addDays(token.createdAt, 21);
  if (expiryDate.getTime() < now) {
    await prisma.newsletter.delete({
      where: {
        token: newsletterToken,
      },
    });
    return (
      <div>
        <h1 className="font-bold text-4xl">Potwierdzenie zapisu do Newsletter&apos;a</h1>
        <p className="text-muted-foreground">Link wygasł. Prosimy o ponowne zapisanie do Newsletter&apos;a.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-bold text-4xl">Potwierdzenie rejestracji konta</h1>
      <p className="text-muted-foreground">Aby dokończyć proces rejestracji prosimy o naciśnięcie przycisku poniżej.</p>
      <p className="text-muted-foreground">Zapis do Newsletter&apos;a można anulować w dowolnej chwili.</p>
      <ConfirmButton token={newsletterToken} />
    </div>
  );
};

export default NewsletterConfirmationPage;
