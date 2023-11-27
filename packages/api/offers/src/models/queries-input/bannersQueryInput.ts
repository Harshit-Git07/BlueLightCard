import { z } from 'zod';
import { validateBrand } from '../../utils/validation';
import { OfferRestrictionQueryInputModel } from './offerRestrictionQueryInput';

export const BannersQueryInputModel = z.object({
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

  limit: z
    .number({
      required_error: 'limit is required',
      invalid_type_error: 'limit must be a number',
    }).optional(),

  restriction: OfferRestrictionQueryInputModel,
});

export type BannersQueryInput = z.infer<typeof BannersQueryInputModel>;
