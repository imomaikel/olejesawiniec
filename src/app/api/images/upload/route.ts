import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

const handler = async (req: Request) => {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ status: 'error', message: 'Brak uprawnień' });
    }

    const formData = await req.formData();

    const file = formData.get('file') as unknown as File | null;
    const isMainPhoto = formData.get('isMainPhoto');
    const productLink = formData.get('productLink');

    if (!file || !isMainPhoto || !productLink) {
      return NextResponse.json({ status: 'error', message: 'Złe żądanie' });
    }

    formData.append('apiKey', process.env.UPLOAD_KEY!);

    let isError = false;
    const response = await new Promise((resolve, reject) => {
      fetch(process.env.UPLOAD_URL!, {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then(async (res) => {
          const { status, data } = res;
          if (status === 'error') {
            reject(data);
          } else if (status === 'success') {
            const imageUrl = data;
            if (isMainPhoto === 'main') {
              await prisma.product.update({
                where: { link: productLink.toString() },
                data: { mainPhoto: imageUrl },
              });
              resolve(imageUrl);
            } else {
              await prisma.product.update({
                where: { link: productLink.toString() },
                data: {
                  extraPhotos: {
                    create: {
                      url: imageUrl,
                      path: res.path,
                    },
                  },
                },
              });
              resolve(imageUrl);
            }
          } else reject('Błąd serwera (1)');
        })
        .catch(() => reject('Błąd serwera (2)'));
    }).catch((error) => {
      isError = true;
      return error;
    });

    return NextResponse.json({
      status: isError ? 'error' : 'success',
      message: response,
    });
  } catch {
    return NextResponse.json({ status: 'error', message: 'Błąd serwera (2)' });
  }
};

export { handler as POST };
