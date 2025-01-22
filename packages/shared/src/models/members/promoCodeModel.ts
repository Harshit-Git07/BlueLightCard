import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';
import { PromoCodeType } from '@blc-mono/shared/models/members/enums/PromoCodeType';

export const PromoCodeModel = createZodNamedType(
  'PromoCodeModel',
  z.object({
    parentId: z.string().uuid(),
    promoCodeType: z.nativeEnum(PromoCodeType),
    singleCodeId: z.string().uuid().optional(),
    name: z.string().optional(),
    validityStartDate: z
      .string()
      .datetime()
      .default(() => new Date().toISOString())
      .optional(),
    validityEndDate: z
      .string()
      .datetime()
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
      .datetime()
      .default(() => new Date().toISOString())
      .optional(),
    lastUpdatedDate: z
      .string()
      .datetime()
      .default(() => new Date().toISOString())
      .optional(),
    active: z.boolean().optional(),
    used: z.boolean().optional(),
    addedDate: z
      .string()
      .datetime()
      .default(() => new Date().toISOString())
      .optional(),
    usedDate: z
      .string()
      .datetime()
      .default(() => new Date().toISOString())
      .optional(),
  }),
);

export type PromoCodeModel = z.infer<typeof PromoCodeModel>;

export const PromoCodeResponseModel = createZodNamedType(
  'PromoCodeResponseModel',
  PromoCodeModel.pick({
    bypassVerification: true,
    bypassPayment: true,
  }),
);
export type PromoCodeResponseModel = z.infer<typeof PromoCodeResponseModel>;
