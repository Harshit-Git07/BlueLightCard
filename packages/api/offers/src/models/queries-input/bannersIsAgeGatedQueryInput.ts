import { z } from 'zod';
import { validateBrand } from '../../utils/validation';

export const BannersIsAgeGatedQueryInputModel = z.object({
  brandId: z
    .string({
      required_error: 'brandId is required',
      invalid_type_error: 'brandId must be a string',
    })
    .refine(
      (brandId) => {
        return validateBrand(brandId);
      },
      { message: 'brandId is invalid' },
    ),

  type: z.string({
    required_error: 'type is required',
    invalid_type_error: 'type must be a string',
  }),

  isAgeGated: z.string({
    required_error: 'isAgeGated is required',
    invalid_type_error: 'isAgeGated must be a string',
  })
    .refine((value) => value === 'true' || value === 'false', {
      message: 'isAgeGated must be a stringified boolean ("true" or "false")',
    })
    .transform((value) => value === 'true'),
});

export type BannersIsAgeGatedQueryInput = z.infer<typeof BannersIsAgeGatedQueryInputModel>;
