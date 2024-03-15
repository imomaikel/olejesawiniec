import { DefaultSession } from 'next-auth';
import { UserRole } from '@prisma/client';

export type AugmentedUser = {
  role: UserRole;
  wishList: string[];
  showVerification: boolean;
} & DefaultSession['user'];

declare module 'next-auth' {
  interface Session {
    user: AugmentedUser;
  }
}
