import { TPixelAction } from './types';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || '';

export const fbPixel = (action: TPixelAction, options: any = {}) => {
  console.log('TRACK');
  if (SERVER_URL.includes('https') && !SERVER_URL.includes('localhost')) {
    window.fbq('track', action, options);
  }
};
