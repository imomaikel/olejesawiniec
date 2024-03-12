import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const MailViewLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="fixed md:left-0 md:top-0 right-0 bottom-0 w-min h-min">
        <Button asChild variant="outline">
          <Link href="/mails">MENU</Link>
        </Button>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default MailViewLayout;
