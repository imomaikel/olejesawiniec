import { z } from 'zod';

const PASSWORD_VALIDATOR = z
  .string()
  .min(6, { message: 'Hasło jest za krótkie!' })
  .max(128, { message: 'Hasło jest za długie!' });

export const SignUpSchema = z
  .object({
    firstName: z.string().min(1, { message: 'Imię jest za krótkie!' }),
    email: z.string().email({ message: 'Nieprawidłowy e-mail!' }).max(64, { message: 'E-mail jest za długi!' }),
    password: PASSWORD_VALIDATOR,
    acceptRules: z.boolean(),
  })
  .superRefine(({ acceptRules }, ctx) => {
    if (!acceptRules) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Aby założyć konto, zaakceptuj regulamin.',
        path: ['acceptRules'],
      });
    }
  });
export type TSignUpSchema = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().email({ message: 'Nieprawidłowy e-mail!' }).max(64, { message: 'E-mail jest za długi!' }),
  password: z.string().min(1, { message: 'Hasło jest za krótkie!' }).max(128, { message: 'Hasło jest za długie!' }),
});
export type TSignInSchema = z.infer<typeof SignInSchema>;

export const PasswordResetSchema = z
  .object({
    password: PASSWORD_VALIDATOR,
    retypePassword: PASSWORD_VALIDATOR,
  })
  .superRefine(({ password, retypePassword }, ctx) => {
    if (password !== retypePassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Podane hasła nie są takie same!',
        path: ['retypePassword'],
      });
    }
  });
export type TPasswordResetSchema = z.infer<typeof PasswordResetSchema>;
