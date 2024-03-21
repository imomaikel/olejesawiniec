'use server';

export const getPaymentMode = (): 'TEST' | 'PRODUCTION' => {
  const mode = process.env.PAYMENT_MODE;
  if (mode === 'PRODUCTION') return 'PRODUCTION';
  return 'TEST';
};
