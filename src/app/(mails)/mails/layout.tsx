'use server';
import { redirect } from 'next/navigation';

const MailsLayout = ({ children }: { children: React.ReactNode }) => {
  if (process.env.NODE_ENV !== 'development') {
    redirect('/');
  }

  return children;
};

export default MailsLayout;
