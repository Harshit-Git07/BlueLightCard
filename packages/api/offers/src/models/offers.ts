import { createZodNamedType } from '../../../core/src/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';

export const OffersModel = createZodNamedType(
  'OffersModel',
  z.object({
    name: z.string(),
    memberId: z.string(),
    email: z.string().optional(),
  }),
);

export type OffersModel = z.infer<typeof OffersModel>;
