import { TRPCProvider } from '@/components/providers/TRPC';
import FacebookPixel from '@/components/FacebookPixel';
import ShoppingCart from '@/components/ShoppingCart';
import MobileNavbar from '@/components/MobileNavbar';
import { SessionProvider } from 'next-auth/react';
import { Epilogue } from 'next/font/google';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';
import './globals.css';

const epilogue = Epilogue({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Oleje Sawiniec',
  description:
    'Olejarnia w zgodzie z naturą - Odkryj moc natury w naszych olejach zimnotłoczonych. Wyjątkowe eliksiry zdrowia, pełne cennych składników odżywczych, które wspierają kondycję mózgu, skóry i układu krążenia.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <html lang="pl" className="h-full scroll-smooth">
        <body className={cn('h-full relative', epilogue.className)}>
          <FacebookPixel />
          <TRPCProvider>
            <main className="relative flex flex-col min-h-screen">
              <div className="flex-1 flex-grow overflow-hidden relative">{children}</div>
            </main>
            <ShoppingCart />
            <MobileNavbar />
          </TRPCProvider>
          <Toaster richColors position="top-center" />
        </body>
      </html>
    </SessionProvider>
  );
}
