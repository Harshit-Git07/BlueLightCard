import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import {z} from 'zod';

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
