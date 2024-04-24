import { TPixelAction } from '@/lib/types';

declare global {
  interface Window {
    fbq: (method: 'track', action: TPixelAction, options: any = {}) => void;
  }
}

export {};
