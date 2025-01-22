import {z} from 'zod';
import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const EcFormOutputDataModel = createZodNamedType(
  'EcFormOutputDataModel',
  z.object({
    employer: z.string(),
    organisation: z.string(),
    employmentStatus: z.string(),
    jobRole: z.string(),
  }),
);

export type EcFormOutputDataModel = z.infer<typeof EcFormOutputDataModel>;
