import { z } from 'zod';

export const OrderDetailsSchema = z
  .object({
    firstName: z.string().min(2, { message: 'Imię jest za krótkie.' }).max(54, { message: 'Limit znaków.' }),
    surname: z.string().min(2, { message: 'Nazwisko jest za krótkie.' }).max(54, { message: 'Limit znaków.' }),
    email: z.string().email({ message: 'Podaj poprawy adres email.' }).max(54, { message: 'Limit znaków.' }),
    phone: z
      .string()
      .min(9, { message: 'Numer telefonu jest za krótki.' })
      .max(12, { message: 'Numer telefonu jest za długi.' }),
    city: z.string().min(2, { message: 'Nazwa miast jest za krótka.' }).max(54, { message: 'Limit znaków.' }),
    postcode: z.string().min(2, { message: 'Kod pocztowy jest za krótki.' }).max(54, { message: 'Limit znaków.' }),

    inpostId: z.optional(z.string().max(54, { message: 'Limit znaków.' })),
    inpostStreet: z.optional(z.string().max(54, { message: 'Limit znaków.' })),
  })
  .refine(
    ({ inpostId, inpostStreet }) => {
      if (!inpostId || !inpostStreet) return false;
      if (inpostId.length + inpostStreet.length <= 4) return false;
      return true;
    },
    { message: 'Podaj numer paczkomatu lub adres.' },
  );

export type TOrderDetailsSchema = z.infer<typeof OrderDetailsSchema>;
