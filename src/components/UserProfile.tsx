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
import { FaUserCircle } from 'react-icons/fa';
import { signOut } from 'next-auth/react';

const UserProfile = () => {
  const user = useCurrentUser();
  if (!user) return null;

  const { email, image, name } = user;
  const username = name ?? email?.split('@')[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex bg-gray-100 rounded-lg px-4 ml-1 py-0.5 items-center">
          <span className="truncate hidden md:block mr-2 max-w-[120px]">{username}</span>
          <Avatar>
            <AvatarImage src={image ?? undefined} />
            <AvatarFallback>
              <FaUserCircle className="h-full w-full" />
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{name ?? email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Wyloguj się</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
