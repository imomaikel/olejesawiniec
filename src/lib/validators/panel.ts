import { z } from 'zod';

const ERROR_MESSAGES = {
  required_error: 'Wymagane',
  invalid_type_error: 'Zły typ danych',
};

export const PanelVariantValidator = z.object({
  capacity: z.preprocess(
    (x) => (x ? x : undefined),
    z.coerce.number(ERROR_MESSAGES).int().min(1, { message: 'Pojemność jest za mała' }),
  ),
  unit: z.string(ERROR_MESSAGES).min(1, { message: 'Jednostka jest za krótka.' }),
  price: z.preprocess(
    (x) => (x ? x : undefined),
    z.coerce.number(ERROR_MESSAGES).min(1, { message: 'Cena jest za mała' }),
  ),
  stock: z.preprocess((x) => (x ? x : undefined), z.coerce.number(ERROR_MESSAGES).int().optional()),
});
export type TPanelVariantValidator = z.infer<typeof PanelVariantValidator>;

export const PanelVariantProductValidator = z.object({
  options: PanelVariantValidator,
  productId: z.string(),
});

export const PanelShippingConfigValidator = z.object({
  inpostPrice: z.number(ERROR_MESSAGES),
  courierPrice: z.number(ERROR_MESSAGES),
  inpostFreeShippingOverPrice: z.number(ERROR_MESSAGES),
});
export type TPanelShippingConfigValidator = z.infer<typeof PanelShippingConfigValidator>;
