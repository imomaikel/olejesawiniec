'use server';
import { redirect } from 'next/navigation';

const MailsLayout = async ({ children }: { children: React.ReactNode }) => {
  if (process.env.NODE_ENV !== 'development') {
    redirect('/');
  }

  return <div>{children}</div>;
};

export default MailsLayout;
