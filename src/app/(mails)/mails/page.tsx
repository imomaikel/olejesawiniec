'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import * as MAILS from './(templates)';

type TMail = keyof typeof MAILS;

const MailPage = () => {
  const [showMail, setShowMail] = useState<TMail | undefined>();
  const searchParams = useSearchParams();
  const mailList = Object.keys(MAILS);
  const pathname = usePathname();
  const router = useRouter();

  const getMail = searchParams.get('mail') as TMail | undefined;
  useEffect(() => {
    if (getMail && !showMail) {
      setShowMail(getMail);
    }
  }, [getMail, showMail]);

  const handleReset = () => {
    setShowMail(undefined);
    const params = new URLSearchParams(searchParams);
    params.delete('mail');
    router.replace(`${pathname}?${params}`);
  };

  if (showMail) {
    const params = new URLSearchParams(searchParams);
    params.set('mail', showMail);
    router.replace(`${pathname}?${params}`);
    return (
      <div>
        {React.createElement(MAILS[showMail].Preview)}
        <Button className="fixed right-0 top-0" onClick={handleReset}>
          RESET
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col space-y-2 items-center underline">
        {mailList.map((entry) => (
          <span key={entry} className="cursor-pointer" onClick={() => setShowMail(entry as TMail)}>
            {entry}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MailPage;
