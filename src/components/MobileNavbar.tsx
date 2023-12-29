'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ProductControls from '@/app/(shop)/sklep/_components/ProductControls';
import PanelControls from '@/app/(panel)/panel/_components/PanelControls';
import { useMobileNav } from '@/hooks/use-mobile-nav';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/utils/constans';
import { useEffect, useState } from 'react';
import { Separator } from './ui/separator';
import CartButton from './CartButton';
import { Button } from './ui/button';
import Link from 'next/link';

const MobileNavbar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, onOpenChange } = useMobileNav();
  const pathname = usePathname();

  useEffect(() => setIsMounted(true), []);

  const showShopNav = pathname.startsWith('/sklep');
  const showPanelNav = pathname.startsWith('/panel');

  if (!isMounted) return null;

  return (
    <Sheet onOpenChange={onOpenChange} open={isOpen}>
      <SheetContent side="left" className="w-[300px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div>
          <CartButton mobileVersion />

          <Separator className="my-4" />

          <ul className="space-y-3">
            {NAV_LINKS.map((entry) => (
              <li key={entry.label}>
                <Button variant="ghost" asChild className="w-full">
                  <Link onClick={onOpenChange} href={entry.path}>
                    {entry.label}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>

          <Separator className="my-4" />

          <div className="flex flex-col space-y-6">
            {showShopNav && <ProductControls />}
            {showPanelNav && <PanelControls />}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;
