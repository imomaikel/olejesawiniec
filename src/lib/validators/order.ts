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

    inpostData: z.optional(
      z.object({
        name: z.string().min(2, { message: 'Nazwa paczkomatu jest za krótka.' }).max(128, { message: 'Limit znaków.' }),
        city: z
          .string()
          .min(2, { message: 'Nazwa miejscowości jest za krótka.' })
          .max(128, { message: 'Limit znaków.' }),
        province: z
          .string()
          .min(2, { message: 'Nazwa województwa jest za krótka.' })
          .max(128, { message: 'Limit znaków.' }),
        postCode: z.string().min(2, { message: 'Kod pocztowy jest za krótki.' }).max(128, { message: 'Limit znaków.' }),
        street: z.string().min(2, { message: 'Nazwa ulicy jest za krótka.' }).max(128, { message: 'Limit znaków.' }),
        buildingNumber: z.optional(z.string().max(128, { message: 'Limit znaków.' })),
        flatNumber: z.optional(z.string().max(128, { message: 'Limit znaków.' })),
      }),
    ),
    courierData: z.optional(
      z.object({
        city: z
          .string()
          .min(2, { message: 'Nazwa miejscowości jest za krótka.' })
          .max(128, { message: 'Limit znaków.' }),
        province: z
          .string()
          .min(2, { message: 'Nazwa województwa jest za krótka.' })
          .max(128, { message: 'Limit znaków.' }),
        postCode: z.string().min(2, { message: 'Kod pocztowy jest za krótki.' }).max(128, { message: 'Limit znaków.' }),
        street: z.string().min(2, { message: 'Nazwa ulicy jest za krótka.' }).max(128, { message: 'Limit znaków.' }),
        building: z
          .string()
          .min(1, { message: 'Numer budynku jest za krótki.' })
          .max(128, { message: 'Limit znaków.' }),
        flat: z.optional(z.string().max(128, { message: 'Limit znaków.' })),
      }),
    ),
  })
  .refine(({ courierData, inpostData }) => {
    if (!courierData || !inpostData) return false;
    return true;
  });

export type TOrderDetailsSchema = z.infer<typeof OrderDetailsSchema>;
