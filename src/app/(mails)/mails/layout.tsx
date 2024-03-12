'use server';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

const MailsLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (session?.user.role !== 'ADMIN') {
    redirect('/sklep');
  }

  return <div>{children}</div>;
};

export default MailsLayout;
