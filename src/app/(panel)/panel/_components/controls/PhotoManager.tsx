'use client';
import { errorToast, successToast } from '@/lib/utils';
import { ExtraPhoto, Product } from '@prisma/client';
import { useUploadThing } from '@/lib/reactHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IoOptions } from 'react-icons/io5';
import { FaImage } from 'react-icons/fa6';
import { useTransition } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

type TPhoto = 'main' | 'extra';
type TPhotoManager = {
  product: Product & {
    extraPhotos: ExtraPhoto[];
  };
  refetch: () => void;
};
const PhotoManager = ({ product, refetch }: TPhotoManager) => {
  const [deletePending, startTransition] = useTransition();

  const fileHeaders = {
    productId: product.id,
    method: 'main' as TPhoto,
  };

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: () => {
      toast.success('Zdjęcie dodane!');
      refetch();
    },
    onUploadError: (err) => {
      toast.error('Nie udało się dodać zdjęcia!');
      console.log(err);
    },
    onUploadBegin: () => {
      toast.info('Dodawanie zdjęcia...');
    },
    headers: () => fileHeaders,
  });

  const uploadFile = (file: File, photoType: TPhoto) => {
    fileHeaders.method = photoType;
    startUpload([file]);
  };

  const deleteFile = (fileId: string) => {
    startTransition(async () => {
      const body = new FormData();
      body.set('fileId', fileId);
      await fetch('/api/uploadthing/delete', {
        method: 'POST',
        body,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 'error') {
            errorToast(res.message);
          } else {
            successToast(res.message);
            refetch();
          }
        })
        .catch(() => {
          errorToast();
        });
    });
  };

  return (
    <div>
      <div className="flex">
        <IoOptions className="w-6 h-6 mr-2" />
        <h2 className="font-medium text-lg">Zdjęcia produktu</h2>
      </div>
      <div className="mb-6">
        <h3 className="mt-4 font-medium">Zdjęcie główne</h3>
        <div className="flex space-x-1 my-2 items-center">
          <p>Aktualne zdjęcie:</p>
          <span>
            {product.mainPhoto ? (
              <Button asChild size="sm" disabled={isUploading}>
                <Link href={product.mainPhoto} className="text-primary ml-2" target="_blank">
                  <div className="flex h-full items-center">
                    <FaImage className="w-5 h-5 mr-2" />
                    <span className="mt-1">PODGLĄD</span>
                  </div>
                </Link>
              </Button>
            ) : (
              'brak'
            )}
          </span>
        </div>
        <div className="flex flex-col">
          <Label htmlFor="mainAdd">Kliknij aby zmienić</Label>
          <Input
            id="mainAdd"
            type="file"
            className="mr-4 max-w-sm"
            disabled={isUploading}
            onChange={(e) => e.target.files && uploadFile(e.target.files[0], 'main')}
          />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="mt-4 font-medium">Dodatkowe zdjęcia</h3>
        <div className="flex space-x-1 my-2 flex-col">
          <div className="flex">
            <p>Aktualne zdjęcia:</p>
            {product.extraPhotos.length <= 0 ? <span className="ml-1">brak</span> : null}
          </div>
          {product.extraPhotos.length >= 1 ? (
            <ol className="leading-8 pl-4 space-y-2 mb-4">
              {product.extraPhotos.map((photo) => (
                <li key={photo.id} className="flex items-center space-x-2">
                  <Button asChild size="sm" disabled={deletePending}>
                    <Link href={photo.url} className="text-primary" target="_blank">
                      <div className="flex h-full items-center">
                        <FaImage className="w-5 h-5 mr-2" />
                        <span className="mt-1">PODGLĄD</span>
                      </div>
                    </Link>
                  </Button>
                  <div className="w-[50px] h-[1px] bg-muted-foreground" />
                  <Button onClick={() => deleteFile(photo.id)} variant="destructive" size="sm">
                    USUŃ
                  </Button>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
        <div className="flex flex-col">
          <Label htmlFor="extraAdd">Kliknij aby dodać nowe</Label>
          <Input
            type="file"
            id="extraAdd"
            className="mr-4 max-w-sm"
            disabled={deletePending}
            onChange={(e) => e.target.files && uploadFile(e.target.files[0], 'extra')}
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoManager;
