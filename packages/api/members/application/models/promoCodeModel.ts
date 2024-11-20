import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';

export const PromoCodeModel = createZodNamedType(
  'PromoCodeModel',
  z.object({
    parentId: z.string().uuid(),
    type: z.string(),
    singleCodeId: z.string().uuid().optional(),
    name: z.string().optional(),
    validityStartDate: z
      .string()
      .date()
      .default(() => new Date().toISOString())
      .optional(),
    validityEndDate: z
      .string()
      .date()
      .default(() => new Date().toISOString())
      .optional(),
    codeProvider: z.string().optional(),
    maxUsages: z.number().optional(),
    currentUsages: z.number().optional(),
    code: z.string(),
    bypassVerification: z.boolean().optional(),
    bypassPayment: z.boolean().optional(),
    cardValidityTerm: z.number().optional(),
    description: z.string().optional(),
    createdDate: z
      .string()
      .date()
      .default(() => new Date().toISOString())
      .optional(),
    lastUpdatedDate: z
      .string()
      .date()
      .default(() => new Date().toISOString())
      .optional(),
    active: z.boolean().optional(),
    used: z.boolean().optional(),
    addedDate: z
      .string()
      .date()
      .default(() => new Date().toISOString())
      .optional(),
    usedDate: z
      .string()
      .date()
      .default(() => new Date().toISOString())
      .optional(),
  }),
);

export type PromoCodeModel = z.infer<typeof PromoCodeModel>;
