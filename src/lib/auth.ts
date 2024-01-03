'use server';
import { SignInSchema, TSignInSchema } from './validators/auth';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
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
    });

    return user;
  } catch {
    return null;
  }
};
export const loginUser = async (credentials: TSignInSchema, redirectTo?: string | null) => {
  const parseFields = SignInSchema.safeParse(credentials);

  if (!parseFields.success) return { error: 'Nieprawidłowe żądanie.' };

  const { email, password } = parseFields.data;

  const user = await getUserByEmail(email);
  if (!user || !user.password) return { error: 'Nieprawidłowe dane logowania!' };

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: redirectTo ?? undefined,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        return { error: 'Nieprawidłowe dane logowania!' };
      } else {
        console.log(error.type, 'sign in error');
        return { error: 'Wystąpił błąd!' };
      }
    }
  }
};
