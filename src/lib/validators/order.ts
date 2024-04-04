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

    method: z.enum(['COURIER', 'INPOST']),

    inpostData: z.optional(
      z.object({
        name: z.string().max(128, { message: 'Limit znaków.' }),
        city: z.string().max(128, { message: 'Limit znaków.' }),
        province: z.string().max(128, { message: 'Limit znaków.' }),
        postCode: z.string().max(128, { message: 'Limit znaków.' }),
        street: z.string().max(128, { message: 'Limit znaków.' }),
        buildingNumber: z.optional(z.string().max(128, { message: 'Limit znaków.' })),
        flatNumber: z.optional(z.string().max(128, { message: 'Limit znaków.' })),
      }),
    ),
    courierData: z.optional(
      z.object({
        city: z.string().max(128, { message: 'Limit znaków.' }),
        province: z.string().max(128, { message: 'Limit znaków.' }),
        postCode: z.string().max(128, { message: 'Limit znaków.' }),
        street: z.string().max(128, { message: 'Limit znaków.' }),
        building: z.string().max(128, { message: 'Limit znaków.' }),
        flat: z.optional(z.string().max(128, { message: 'Limit znaków.' })),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    const { courierData, inpostData, method } = data;

    if ((!inpostData && !courierData) || !method) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Wpełnij jedną z metod dostaw',
        path: ['method'],
      });
    }

    if (method === 'COURIER') {
      const cityLength = courierData?.city.length ?? 0;
      const provinceLength = courierData?.province.length ?? 0;
      const postCodeLength = courierData?.postCode.length ?? 0;
      const streetLength = courierData?.street.length ?? 0;
      const buildingLength = courierData?.building.length ?? 0;

      if (cityLength < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nazwa miejscowości jest za krótka',
          path: ['courierData.city'],
        });
      }
      if (provinceLength < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nazwa województwa jest za krótka',
          path: ['courierData.province'],
        });
      }
      if (postCodeLength < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Kod pocztowy jest za krótki',
          path: ['courierData.postCode'],
        });
      }
      if (streetLength < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nazwa ulicy jest za krótka',
          path: ['courierData.street'],
        });
      }
      if (buildingLength < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Numer budynku jest za krótki',
          path: ['courierData.building'],
        });
      }
    } else {
      const nameLength = inpostData?.name.length ?? 0;
      const cityLength = inpostData?.city.length ?? 0;
      const provinceLength = inpostData?.province.length ?? 0;
      const postCodeLength = inpostData?.postCode.length ?? 0;
      const streetLength = inpostData?.street.length ?? 0;

      if (nameLength < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Numer paczkomatu jest za krótka,',
          path: ['inpostData.name'],
        });
      }
      if (cityLength < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nazwa miejscowości jest za krótka.',
          path: ['inpostData.city'],
        });
      }
      if (provinceLength < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nazwa województwa jest za krótka.',
          path: ['inpostData.province'],
        });
      }
      if (postCodeLength < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Kod pocztowy jest za krótki.',
          path: ['inpostData.postCode'],
        });
      }
      if (streetLength < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nazwa ulicy jest za krótka.',
          path: ['inpostData.street'],
        });
      }
    }
  });
export type TOrderDetailsSchema = z.infer<typeof OrderDetailsSchema>;

export const BasketVariantSchema = z.object({
  quantity: z.number(),
  variant: z.object({
    id: z.string(),
    unit: z.string(),
    price: z.number(),
    capacity: z.number(),
    product: z
      .object({
        link: z.string(),
        label: z.string(),
        mainPhoto: z.string().nullable(),
      })
      .nullable(),
  }),
});
export const BasketVariantsSchema = z.array(BasketVariantSchema);
export type TBasketVariantSchema = z.infer<typeof BasketVariantSchema>;
export type TBasketVariantsSchema = z.infer<typeof BasketVariantsSchema>;

export const RatingSchema = z.object({
  cashbillId: z.string(),
  originalProductId: z.string(),
  rating: z
    .number()
    .min(1, { message: 'Ocena musi być w skali 1-5' })
    .max(5, { message: 'Ocena musi być w skali 1-5' }),
});
