import { FileRouter, UTApi, UploadThingError } from 'uploadthing/server';
import { createUploadthing } from 'uploadthing/next';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export const utapi = new UTApi();
const f = createUploadthing();

export const fileRouter = {
  imageUploader: f({ image: { maxFileSize: '1MB' } })
    .middleware(async ({ req }) => {
      const session = await auth();

      if (!session || !session.user || session.user.role !== 'ADMIN') throw new UploadThingError('Brak uprawnień');

      const productId = req.headers.get('productId');
      const method = req.headers.get('method') as 'main' | 'extra';

      if (!(method === 'main' || method === 'extra')) {
        throw new UploadThingError('Nieprawidłowa metoda');
      }

      const product = productId
        ? await prisma.product.findUnique({
            where: { id: productId },
          })
        : null;

      if (!product) throw new UploadThingError('Nieprawidłowy produkt');

      return { userId: session.user.id, userName: session.user.name, productId, method, oldPhotoId: product.mainPhoto };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      if (!file.url || !metadata.productId) return { error: true };

      if (metadata.method === 'main') {
        if (metadata.oldPhotoId) {
          const file = metadata.oldPhotoId.split('/');
          const fileName = file[file.length - 1];
          await utapi.deleteFiles(fileName).catch(() => {});
        }
        await prisma.product.update({
          where: { id: metadata.productId },
          data: { mainPhoto: file.url },
        });
      } else {
        await prisma.product.update({
          where: { id: metadata.productId },
          data: {
            extraPhotos: {
              create: {
                url: file.url,
              },
            },
          },
        });
      }

      return { success: true };
    }),
} satisfies FileRouter;

export type TFileRouter = typeof fileRouter;
