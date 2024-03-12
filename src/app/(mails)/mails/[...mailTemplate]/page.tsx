'use server';
import { redirect } from 'next/navigation';
import * as MAILS from '.';

const MailViewPage = async ({ params }: { params: { mailTemplate: string } }) => {
  const mailTemplate = params.mailTemplate as keyof typeof MAILS;
  const availableMails = Object.keys(MAILS);

  const mailToView = mailTemplate[0] as keyof typeof MAILS;

  if (availableMails.includes(mailToView)) {
    const Mail = MAILS[mailToView];
    return <Mail />;
  } else {
    redirect('/mails');
  }
};

export default MailViewPage;
