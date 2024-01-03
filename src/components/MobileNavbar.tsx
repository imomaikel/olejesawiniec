'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ProductControls from '@/app/(shop)/sklep/_components/ProductControls';
import PanelControls from '@/app/(panel)/panel/_components/PanelControls';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMobileNav } from '@/hooks/use-mobile-nav';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/utils/constans';
import { useEffect, useState } from 'react';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';

const MobileNavbar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, onOpenChange } = useMobileNav();
  const pathname = usePathname();
  const user = useCurrentUser();

  useEffect(() => setIsMounted(true), []);

  const showShopNav = pathname.startsWith('/sklep');
  const showPanelNav = pathname.startsWith('/panel');

  if (!isMounted) return null;
  const signatureImageUrl = pathname.startsWith('/sklep/') ? '/sklep' : pathname.startsWith('/panel') ? '/panel' : '/';

  return (
    <Sheet onOpenChange={onOpenChange} open={isOpen}>
      <SheetContent side="left" className="w-[300px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div>
          <div className="relative mt-4">
            <Link href={signatureImageUrl}>
              <Image
                src={'/signatureBlack.png'}
                className="object-contain object-center"
                width={271}
                priority={true}
                loading="eager"
                height={107}
                alt="podpis"
              />
            </Link>
          </div>

          <Separator className="my-4" />

          <ul className="space-y-3">
            {NAV_LINKS.map((entry) => {
              if (entry.path === '/logowanie') {
                if (user?.id) return null;
              }
              if (entry.path === '/panel') {
                if (!(user?.role === 'ADMIN' || user?.role === 'SUPPORT')) return null;
              }

              return (
                <li key={entry.label}>
                  <Button variant="ghost" asChild className="w-full">
                    <Link onClick={onOpenChange} href={entry.path}>
                      {entry.label}
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>

          <Separator className="my-4" />

          <div className="flex flex-col space-y-6">
            {showShopNav && <ProductControls mobileVersion />}
            {showPanelNav && <PanelControls />}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;
