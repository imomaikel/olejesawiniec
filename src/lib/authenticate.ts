'use server';
import { SignInSchema, TSignInSchema, TSignUpSchema } from './validators/auth';
import { getUserByEmail } from './data';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import prisma from './prisma';
import bcrypt from 'bcryptjs';

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
        wishList: {
          create: {},
        },
      },
    });
  } catch {
    return { error: 'Wystąpił błąd' };
  }

  return { success: 'Konto założone!' };
};
