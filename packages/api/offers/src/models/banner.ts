import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const BannerModel = createZodNamedType(
  'BannerModel',
  z.object({
    id: z.number({
      required_error: 'ID is required',
      invalid_type_error: 'ID must be a number',
    }),
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    start: z.coerce.date({
      required_error: 'Start is required',
      invalid_type_error: 'Start must be a date',
    }),
    end: z.coerce.date({
      required_error: 'End is required',
      invalid_type_error: 'End must be a date',
    }),
    status: z.number({
      required_error: 'Status is required',
      invalid_type_error: 'Status must be a number',
    }),
    link: z
      .string({
        required_error: 'Link is required',
        invalid_type_error: 'Start must be a string',
      })
      .url(),
    bannername: z.string({
      required_error: 'Bannername is required',
      invalid_type_error: 'Start must be a string',
    }),
    promotiontype: z.number({
      required_error: 'Promotiontype is required',
      invalid_type_error: 'Start must be a number',
    }),
    cid: z.number({
      required_error: 'Company ID is required',
      invalid_type_error: 'Company ID must be a number',
    }),
  })
);

export type Banner = z.infer<typeof BannerModel>;
