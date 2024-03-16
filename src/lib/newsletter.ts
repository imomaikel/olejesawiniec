'use server';
import { handlePrismaError } from '@/server/routers/errors';
import { sendMail } from '@/server/mails/nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';
import prisma from './prisma';
import { z } from 'zod';

export const signUpForNewsletter = async (mail: string) => {
  const safeMail = z.string().email().safeParse(mail);

  if (!safeMail.success) {
    return { error: true, message: 'Podaj prawidłowy adres email.' };
  }

  try {
    const newsletterExist = await prisma.newsletter.findUnique({
      where: { email: safeMail.data },
    });

    if (newsletterExist && newsletterExist.verified) {
      return { error: true, message: 'Podany użytkownik jest już zapisany.' };
    }

    if (newsletterExist && !newsletterExist.verified) {
      const now = new Date().getTime();
      const expiryAt = addDays(newsletterExist.createdAt, 21).getTime();
      if (expiryAt < now) {
        await prisma.newsletter.delete({
          where: {
            email: safeMail.data,
          },
        });
      }
    }

    const verifyToken = uuidv4();
    await prisma.newsletter.create({
      data: {
        email: safeMail.data,
        token: verifyToken,
        verified: false,
      },
    });

    const mail = await sendMail(
      'NewsletterMail',
      {
        confirmUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/newsletter/${verifyToken}`,
      },
      {
        sendTo: safeMail.data,
        subject: "Potwierdź zapis do Newsletter'a",
      },
    );

    if (mail.error) {
      await prisma.newsletter.delete({
        where: {
          email: safeMail.data,
          verified: false,
        },
      });
      return { error: true, message: 'Wystąpił błąd.' };
    }

    return { success: true };
  } catch (error) {
    if (handlePrismaError(error) === 'Object already exists') {
      return { error: true, message: 'Podany użytkownik jest już zapisany.' };
    }
    return { error: true, message: 'Wystąpił błąd.' };
  }
};

export const confirmNewsletter = async (token: string) => {
  const findToken = await prisma.newsletter.findUnique({
    where: {
      token,
      verified: false,
    },
  });

  if (!findToken) {
    return { error: true, message: 'Nie udało się potwierdzić zapisu.' };
  }

  await prisma.newsletter.update({
    where: { token },
    data: {
      token: null,
      verified: true,
    },
  });

  return { success: true };
};
