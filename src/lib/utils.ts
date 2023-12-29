import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(price);
};

export const successToast = (message: string) => {
  toast.success(message);
};
export const errorToast = (message?: string) => {
  toast.error(`Wystąpił błąd! ${message ?? ''}`);
};
