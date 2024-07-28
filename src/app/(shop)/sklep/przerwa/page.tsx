'use server';
import StoreDisabled from '@/components/StoreDisabled';
import { redirect } from 'next/navigation';
import React from 'react';

const StoreDisabledPage = async () => {
  if (process.env.NEXT_PUBLIC_STORE_DISABLED !== 'true') {
    return redirect('/sklep');
  }

  return (
    <div className="my-12 flex justify-center items-center">
      <StoreDisabled />
    </div>
  );
};

export default StoreDisabledPage;
