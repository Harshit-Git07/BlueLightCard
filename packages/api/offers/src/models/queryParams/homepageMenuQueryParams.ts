import { z } from 'zod';
import { validateBrand } from '../../utils/validation';

export const HomepageMenuQueryParamsModel = z.object({
  brand: z
    .string({
      required_error: 'brand is required',
      invalid_type_error: 'brand must be a string',
    })
    .refine(
      (brandId) => {
        return validateBrand(brandId);
      },
      { message: 'brandId is invalid' },
    ),
  isAgeGated: z
    .string({
      required_error: 'isAgeGated is required',
      invalid_type_error: 'isAgeGated must be a string',
    })
    .refine((value) => value === 'true' || value === 'false', {
      message: 'isAgeGated must be a stringified boolean ("true" or "false")',
    })
    .transform((value) => value === 'true'),
});

export type HomepageMenuQueryParams = z.infer<typeof HomepageMenuQueryParamsModel>;
