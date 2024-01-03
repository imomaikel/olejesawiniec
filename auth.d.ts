import { UserRole } from '@prisma/client';
import { DefaultSession } from 'next-auth';

export type AugmentedUser = {
  role: UserRole;
} & DefaultSession['user'];

declare module 'next-auth' {
  interface Session {
    user: AugmentedUser;
  }
}
