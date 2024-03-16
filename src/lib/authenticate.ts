'use server';
import { PasswordResetSchema, SignInSchema, SignUpSchema, TSignInSchema, TSignUpSchema } from './validators/auth';
import { addDays, addMinutes, hoursToMilliseconds } from 'date-fns';
import { sendMail } from '@/server/mails/nodemailer';
import { getUserByEmail } from './data';
import { isDayOrNight } from './utils';
import { AuthError } from 'next-auth';
import { auth, signIn } from '@/auth';
import { v4 as uuidv4 } from 'uuid';
import prisma from './prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const afterVerification = async () => {
  const session = await auth();
  if (!session?.user.email) return;

  await prisma.user
    .update({
      where: { email: session.user.email, emailVerified: { equals: null } },
      data: { forceLogin: false, emailVerified: new Date() },
    })
    .catch(() => {});
  await prisma.verificationToken.deleteMany({
    where: { email: session.user.email },
  });
};

export const signInUser = async (credentials: TSignInSchema, redirectTo?: string | null) => {
  const parseFields = SignInSchema.safeParse(credentials);

  if (!parseFields.success) return { error: 'Nieprawidłowe żądanie.' };

  const { email, password } = parseFields.data;

  const user = await getUserByEmail(email);
  if (!user || !user.password) return { error: 'Nieprawidłowe dane logowania!' };

  if (!user.emailVerified)
    return { error: 'Proszę potwierdzić swoje konto poprzez e-mail, aby móc się zalogować. Dziękujemy!' };

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
  const parseFields = SignUpSchema.safeParse(credentials);

  if (!parseFields.success) return { error: 'Nieprawidłowe żądanie.' };

  const { email, password, firstName } = parseFields.data;

  let alreadyExist = await prisma.user.findUnique({
    where: { email: email },
  });

  if (alreadyExist?.createdAt && !alreadyExist.emailVerified && alreadyExist.email) {
    const createdAt = alreadyExist.createdAt.getTime();
    const now = new Date().getTime();
    if (createdAt + hoursToMilliseconds(24 * 7) >= now) {
      await prisma.user.delete({
        where: { email: alreadyExist.email },
      });
      await prisma.verificationToken.deleteMany({
        where: { email: alreadyExist.email },
      });
      alreadyExist = null;
    }
  }

  if (alreadyExist) {
    return { error: 'Podany adres email jest zajęty.' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const token = uuidv4();
    const expires = addDays(new Date(), 7);

    await prisma.$transaction(async (tx) => {
      const verifyToken = await tx.verificationToken.create({
        data: {
          email,
          expires,
          token,
        },
      });
      await tx.user.create({
        data: {
          firstName,
          email,
          password: hashedPassword,
        },
      });
      await sendMail(
        'SignUpMail',
        {
          confirmUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/weryfikacja/${verifyToken.token}`,
          dayOrNightTime: isDayOrNight(),
          username: firstName,
        },
        {
          sendTo: email,
          subject: 'Weryfikacja konta',
        },
      ).then(({ error }) => {
        if (error) throw new Error();
      });
    });
  } catch {
    return { error: 'Wystąpił błąd' };
  }

  return { success: 'Konto założone!' };
};

export const forgotPassword = async (email: string) => {
  try {
    const safeEmail = z.string().email().safeParse(email);

    if (!safeEmail.success) {
      return { error: true, message: 'Podaj prawidłowy adres e-mail!' };
    }

    const user = await prisma.user.findUnique({
      where: { email: safeEmail.data },
    });

    if (!user?.email) {
      return { error: true, message: 'Nie znaleziono użytkownika z podanym adresem e-mail!' };
    }

    const resetToken = uuidv4();
    const expiryAt = addMinutes(new Date(), 30);

    await prisma.user.update({
      where: { email: safeEmail.data },
      data: {
        passwordResetToken: resetToken,
        passwordResetTokenExpires: expiryAt,
      },
    });

    const mail = await sendMail(
      'PasswordResetMail',
      {
        dayOrNightTime: isDayOrNight(),
        passwordResetUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/logowanie/reset/${resetToken}`,
        username: user.firstName || user.name || user.email,
      },
      {
        sendTo: safeEmail.data,
        subject: 'Prośba o przypomnienie hasła',
      },
    );

    if (mail.error) {
      return { success: true, message: 'Nie udało się wyslać e-maila.' };
    }

    return { success: true, message: 'Wysłaliśmy do Ciebie e-mail.' };
  } catch {
    return { error: true, message: 'Wystąpił błąd.' };
  }
};

export const forgottenPasswordSetNew = async (password: string, retypePassword: string, resetToken: string) => {
  try {
    const safeInput = PasswordResetSchema.safeParse({ password, retypePassword });

    if (!safeInput.success) {
      return { error: true, message: 'Podane hasła nie są takie same!' };
    }

    const newPassword = safeInput.data.password;

    const user = await prisma.user.findUnique({
      where: { passwordResetToken: resetToken },
    });

    if (!user || !user.passwordResetTokenExpires || !user.passwordResetToken) {
      return {
        error: true,
        message: 'Link nie jest prawidłowy lub wygasł. Prosimy o wykonanie tej czynności od nowa.',
      };
    }

    const tokenExpires = user.passwordResetTokenExpires?.getTime();
    const now = new Date().getTime();

    if (tokenExpires < now) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: null,
          passwordResetTokenExpires: null,
        },
      });
      return { error: true, message: 'Link do zmiany hasła wygasł. Prosimy o wykonanie tej czynności od nowa.' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpires: null,
      },
    });

    return { success: true };
  } catch {
    return { error: true, message: 'Wystąpił błąd.' };
  }
};
