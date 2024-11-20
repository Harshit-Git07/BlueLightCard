import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const BrazeAttributesModel = createZodNamedType(
  'BrazeAttributesModel',
  z.object({
    attributes: z.string().array().default([]),
  }),
);

export type BrazeAttributesModel = z.infer<typeof BrazeAttributesModel>;
