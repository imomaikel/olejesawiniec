'use client';
import { RiErrorWarningFill } from 'react-icons/ri';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import Link from 'next/link';

const ImportantMessage = () => {
  const { importantMessageHidden, toggleImportantMessageHidden } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (process.env.NEXT_PUBLIC_STORE_DISABLED !== 'true' || !isMounted || importantMessageHidden) return null;

  return (
    <div className="fixed top-36 md:left-4 p-4 border-2 rounded border-destructive z-50 bg-background">
      <div className="flex space-x-2">
        <RiErrorWarningFill className="h-8 w-8" />
        <span className="font-bold md:text-lg">Sklep jest wyłączony do 1 września 2024r.</span>
      </div>
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button size="lg" onClick={() => toggleImportantMessageHidden(!importantMessageHidden)} variant="outline">
          Ignoruj
        </Button>
        <Button size="lg" asChild>
          <Link href="/sklep/przerwa">Więcej Informacji</Link>
        </Button>
      </div>
    </div>
  );
};

export default ImportantMessage;
