'use client';
import * as MAILS from './[...mailTemplate]';
import Link from 'next/link';

const MailPage = () => {
  const mailList = Object.keys(MAILS);

  return (
    <div className="fixed w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col space-y-2 items-center underline">
        {mailList.map((entry, index) => (
          <Link
            href={`/mails/${entry}`}
            key={`link${entry}${index}`}
            className="cursor-pointer p-3 bg-muted rounded-lg border"
          >
            {entry}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MailPage;
