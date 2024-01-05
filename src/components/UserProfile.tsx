import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useCurrentUser } from '@/hooks/use-current-user';
import { usePathname } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import { FaUser } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const UserProfile = () => {
  const pathname = usePathname();
  const user = useCurrentUser();
  if (!user) return null;

  const { email, image, name } = user;
  const username = name ?? email?.split('@')[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn('rounded-full', pathname === '/' && 'ml-1')}>
        <div
          className={cn(
            'flex border rounded-full px-4 ml-1 py-0.5 items-center transition-colors hover:border-primary',
            pathname === '/' && 'border-white ml-0',
          )}
        >
          <span className="truncate hidden md:block mr-2 max-w-[120px]">{username}</span>
          <Avatar>
            <AvatarImage src={image ?? undefined} />
            <AvatarFallback className={cn(pathname === '/' && 'bg-transparent')}>
              {pathname === '/' ? <FaUser className="h-3/4 w-3/4" /> : <FaUserCircle className="h-full w-full" />}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{name ?? email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/lista-zyczen">Lista życzeń</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Wyloguj się</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
