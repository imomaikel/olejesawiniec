import { z } from 'zod';

export const AuthValidator = z.object({
  email: z.string().email({ message: 'Nieprawidłowy e-mail!' }).max(64, { message: 'E-mail jest za długi!' }),
  password: z.string().min(6, { message: 'Hasło jest za krótkie!' }).max(128, { message: 'Hasło jest za długie!' }),
});
export type TAuthValidator = z.infer<typeof AuthValidator>;
