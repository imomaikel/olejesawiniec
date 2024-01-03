'use server';
import { SignInSchema, TSignInSchema, TSignUpSchema } from './validators/auth';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import prisma from './prisma';
import bcrypt from 'bcryptjs';

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

export const signInUser = async (credentials: TSignInSchema, redirectTo?: string | null) => {
  const parseFields = SignInSchema.safeParse(credentials);

  if (!parseFields.success) return { error: 'Nieprawidłowe żądanie.' };

  const { email, password } = parseFields.data;

  const user = await getUserByEmail(email);
  if (!user || !user.password) return { error: 'Nieprawidłowe dane logowania!' };

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: redirectTo ?? '/sklep',
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
    throw error;
  }
};

export const signUpUser = async (credentials: TSignUpSchema) => {
  const parseFields = SignInSchema.safeParse(credentials);

  if (!parseFields.success) return { error: 'Nieprawidłowe żądanie.' };

  const { email, password } = parseFields.data;

  const alreadyExist = await prisma.user.findUnique({
    where: { email: email },
  });

  if (alreadyExist) {
    return { error: 'Podany adres email jest zajęty.' };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  } catch {
    return { error: 'Wystąpił błąd' };
  }

  try {
    const status = await signInUser({ email, password });
    if (status?.error) {
      return { error: status.error };
    }
  } catch {}

  return { success: 'Konto założone!' };
};
