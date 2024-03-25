import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { utapi } from '../core';
import { auth } from '@/auth';

const handler = async (req: Request) => {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ status: 'error', message: 'Brak uprawnień' });
    }

    const formData = await req.formData();

    const fileId = formData.get('fileId')?.toString();
    if (!fileId) {
      return NextResponse.json({ status: 'error', message: 'Złe żądanie' });
    }

    const photo = await prisma.extraPhoto.findFirst({
      where: { id: fileId },
    });
    if (!photo) {
      return NextResponse.json({ status: 'error', message: 'Złe żądanie' });
    }

    try {
      const file = photo.url.split('/');
      const fileName = file[file.length - 1];
      await utapi.deleteFiles(fileName);
    } catch {
      return NextResponse.json({
        status: 'error',
        message: 'Wystąpił błąd!',
      });
    }

    await prisma.extraPhoto.delete({
      where: { id: fileId },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Zdjęcie usunięte',
    });
  } catch {
    return NextResponse.json({ status: 'error', message: 'Błąd serwera (2)' });
  }
};

export { handler as POST };
