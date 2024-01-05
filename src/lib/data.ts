'use server';
import prisma from './prisma';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        wishList: {
          include: {
            variant: true,
          },
        },
      },
    });

    return user;
  } catch {
    return null;
  }
};
