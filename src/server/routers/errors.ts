export const handlePrismaError = (error: any) => {
  try {
    const errorCode = error?.code;
    if (errorCode) {
      if (errorCode === 'P2002') {
        return 'Object already exists';
      } else if (errorCode === 'P2025') {
        return 'Błąd bazy danych.';
      } else {
        console.log('Unknown Prisma error code:', errorCode);
      }
    }
  } catch {}
  return 'Unknown error';
};
