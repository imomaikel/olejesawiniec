'use client';
import { Skeleton } from '@/components/ui/skeleton';
import AuthTabs from './_components/AuthTabs';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AuthPage = () => {
  return (
    <div className="w-full md:h-screen flex items-center mt-16 md:mt-0 justify-start md:justify-center relative flex-col">
      <div className="relative w-[350px] md:w-[400px] flex justify-center">
        <Link href="/sklep">
          <Image src="/signatureBlack.png" width={300} height={120} alt="podpis" className="object-center" />
        </Link>
      </div>
      <p className="text-xs text-muted-foreground">Wybierz metodę</p>
      <Suspense fallback={<AuthPage.Fallback />}>
        <AuthTabs />
      </Suspense>
    </div>
  );
};
AuthPage.Fallback = function ShowSkeleton() {
  return (
    <div className="flex flex-col space-y-2">
      <Skeleton className="w-[350px] md:w-[400px] h-9 bg-black/5" />
      <Skeleton className="w-[350px] md:w-[400px] h-[417px] bg-black/5" />
    </div>
  );
};

export default AuthPage;
