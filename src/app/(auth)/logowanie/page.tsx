'use client';
import { Skeleton } from '@/components/ui/skeleton';
import AuthTabs from './_components/AuthTabs';
import { Suspense } from 'react';

const AuthPage = () => {
  return (
    <div>
      <p className="text-xs text-muted-foreground text-center">Wybierz metodę</p>
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
