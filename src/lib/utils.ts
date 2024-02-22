import { PaymentStatus, ShippingType } from '@prisma/client';
import { type ClassValue, clsx } from 'clsx';
import { formatRelative } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import { pl } from 'date-fns/locale';
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
export const relativeDate = (date: Date, baseDate?: Date) => {
  const relative = formatRelative(date, baseDate ?? new Date(), {
    locale: { ...pl },
  });
  return relative;
};

export const translatePaymentStatus = (currentStatus: PaymentStatus) => {
  if (currentStatus === 'PreStart') {
    return 'Płatność rozpoczęta';
  } else if (currentStatus === 'Start') {
    return 'Oczekiwanie na płatność';
  } else if (currentStatus === 'Abort') {
    return 'Płatność wstrzymana';
  } else if (currentStatus === 'Fraud') {
    return 'Płatność zablokowana przez CashBill';
  } else if (currentStatus === 'NegativeAuthorization') {
    return 'Płatność zablokowana';
  } else if (currentStatus === 'NegativeFinish') {
    return 'Płatność odrzucona';
  } else if (currentStatus === 'PositiveAuthorization') {
    return 'Płatność w realizacji';
  } else if (currentStatus === 'PositiveFinish') {
    return 'Zamówienie opłacone';
  } else if (currentStatus === 'Order_finished') {
    return 'Zamówienie zrealizowane';
  } else if (currentStatus === 'Order_processing') {
    return 'Zamówienie w realizacji';
  } else if (currentStatus === 'Order_ready') {
    return 'Zamówienie gotowe do wysyłki';
  } else if (currentStatus === 'Order_sent') {
    return 'Zamówienie wysłane';
  }
  return 'Nieznany';
};
export const nextPaymentStep = (currentStatus: PaymentStatus): ReturnType<typeof translatePaymentStatus> | null => {
  if (
    currentStatus === 'PreStart' ||
    currentStatus === 'Start' ||
    currentStatus === 'NegativeAuthorization' ||
    currentStatus === 'Abort' ||
    currentStatus === 'PositiveAuthorization'
  ) {
    return 'Zamówienie opłacone';
  }
  if (currentStatus === 'PositiveFinish') {
    return 'Zamówienie w realizacji';
  } else if (currentStatus === 'Order_processing') {
    return 'Zamówienie gotowe do wysyłki';
  } else if (currentStatus === 'Order_ready') {
    return 'Zamówienie wysłane';
  } else if (currentStatus === 'Order_sent') {
    return 'Zamówienie zrealizowane';
  }
  return null;
};
export const getNextPaymentSteps = (
  currentStatus: PaymentStatus,
): { key: PaymentStatus; label: ReturnType<typeof translatePaymentStatus> }[] => {
  const data: ReturnType<typeof getNextPaymentSteps> = [
    {
      key: 'Order_processing',
      label: 'Zamówienie w realizacji',
    },
    {
      key: 'Order_ready',
      label: 'Zamówienie gotowe do wysyłki',
    },
    {
      key: 'Order_sent',
      label: 'Zamówienie wysłane',
    },
    {
      key: 'Order_finished',
      label: 'Zamówienie zrealizowane',
    },
  ];
  if (currentStatus === 'PositiveFinish') {
    return data;
  }
  if (currentStatus === 'Order_processing') {
    return data.slice(1);
  }
  if (currentStatus === 'Order_ready') {
    return data.slice(2);
  }
  if (currentStatus === 'Order_sent') {
    return data.slice(3);
  }

  return [];
};

export const pad = (number: number) => {
  return number.toString().padStart(2, '0');
};

export const translateShippingMethod = (method: ShippingType) => {
  if (method === 'COURIER') return 'Kurier';
  if (method === 'INPOST') return 'Paczkomat';
};
