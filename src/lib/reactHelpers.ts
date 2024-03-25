import { generateReactHelpers } from '@uploadthing/react';
import { TFileRouter } from '@/app/api/uploadthing/core';

export const { useUploadThing, uploadFiles } = generateReactHelpers<TFileRouter>();
