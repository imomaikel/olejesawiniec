import { z } from 'zod';

export const SignUpSchema = z.object({
  firstName: z.string().min(1, { message: 'Imię jest za krótkie!' }),
  email: z.string().email({ message: 'Nieprawidłowy e-mail!' }).max(64, { message: 'E-mail jest za długi!' }),
  password: z.string().min(6, { message: 'Hasło jest za krótkie!' }).max(128, { message: 'Hasło jest za długie!' }),
});
export type TSignUpSchema = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().email({ message: 'Nieprawidłowy e-mail!' }).max(64, { message: 'E-mail jest za długi!' }),
  password: z.string().min(1, { message: 'Hasło jest za krótkie!' }).max(128, { message: 'Hasło jest za długie!' }),
});
export type TSignInSchema = z.infer<typeof SignInSchema>;
