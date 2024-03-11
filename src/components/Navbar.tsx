'use client';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMobileNav } from '@/hooks/use-mobile-nav';
import { GiHamburgerMenu } from 'react-icons/gi';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/utils/constans';
import UserProfile from './UserProfile';
import CartButton from './CartButton';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

type TNavbar = {
  className?: string;
  textColor?: 'white' | 'black';
  topPadding?: number;
};
const Navbar = ({ className, textColor, topPadding }: TNavbar) => {
  const { onOpen: onMobileNavOpen } = useMobileNav();
  const pathname = usePathname();
  const user = useCurrentUser();

  const signatureImageUrl =
    pathname.startsWith('/sklep/') || pathname.startsWith('/lista-zyczen')
      ? '/sklep'
      : pathname.startsWith('/panel')
      ? '/panel'
      : '/';

  return (
    <div className={cn('w-full absolute z-20', className)}>
      <div
        className={cn(
          'w-full min-h-fit max-w-7xl mx-auto flex justify-between lg:px-20',
          topPadding !== undefined ? `pt-${topPadding}` : 'pt-6',
        )}
      >
        <div className="flex md:hidden items-center" role="button" onClick={onMobileNavOpen} aria-label="wysuń menu">
          <GiHamburgerMenu
            className={cn(
              'w-12 h-12 cursor-pointer hover:text-primary transition-colors',
              textColor === 'black' ? 'text-black' : 'text-white',
            )}
          />
        </div>
        <div className="relative hidden md:block">
          <Link href={signatureImageUrl}>
            <Image
              src={textColor === 'black' ? '/signatureBlack.png' : '/signature.png'}
              className="object-contain object-center"
              width={271}
              priority={true}
              loading="eager"
              height={107}
              alt="podpis"
            />
          </Link>
        </div>
        <div className={cn('items-center text-white flex', textColor === 'black' ? 'text-black' : 'text-white')}>
          <ul className="space-x-5 hidden md:flex">
            {NAV_LINKS.map((entry) => {
              if (entry.path === '/logowanie') {
                if (user?.id) return null;
              }
              if (entry.path === '/panel') {
                if (!(user?.role === 'ADMIN' || user?.role === 'SUPPORT')) return null;
              }
              if (pathname === entry.path) return null;

              return (
                <li key={entry.label}>
                  <Button variant="ghost" asChild>
                    {entry.path === '/logowanie' && pathname.length >= 2 ? (
                      <Link href={`${entry.path}?powrót=${pathname}`}>{entry.label}</Link>
                    ) : (
                      <Link href={entry.path}>{entry.label}</Link>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
          <UserProfile />
          <CartButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
