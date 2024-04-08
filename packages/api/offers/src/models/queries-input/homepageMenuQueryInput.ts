import { BLC_UK, BLC_AUS, DDS_UK } from '../../utils/global-constants';
import { z } from 'zod';

export const OfferHomepageQueryInputModel = z.object({
  brandId: z.enum([BLC_UK, BLC_AUS, DDS_UK], {
    required_error: 'brandId is required',
    invalid_type_error: 'brandId must be one of the following values: blc-uk, blc-aus, dds-uk',
  }),
  isUnder18: z
    .string({
      required_error: 'isUnder18 is required',
      invalid_type_error: 'isUnder18 must be a string',
    })
    .refine((value) => value === 'true' || value === 'false', {
      message: 'isUnder18 must be a stringified boolean ("true" or "false")',
    })
    .transform((value) => value === 'true'),
  organisation: z
    .string({
      invalid_type_error: 'organisation must be a string',
    })
    .optional(),
});

export type OfferHomepageQueryInput = z.infer<typeof OfferHomepageQueryInputModel>;
