export const getPaymentMode = async () => {
  const mode = process.env.PAYMENT_MODE;
  if (mode === 'PRODUCTION') return 'PRODUCTION';
  return 'TEST';
};
