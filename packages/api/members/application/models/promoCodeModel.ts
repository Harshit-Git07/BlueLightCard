import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';
import { transformDateToFormatYYYYMMDD } from '@blc-mono/core/utils/date';

export const PromoCodeModel = createZodNamedType(
  'PromoCodeModel',
  z
    .object({
      pk: z.string().startsWith('PROMO_CODE#'),
      sk: z.string(),
      name: z.string().optional(),
      validityStartDate: z.string().datetime().optional(),
      validityEndDate: z.string().datetime().optional(),
      codeProvider: z.string().optional(),
      maxUsages: z.number().optional(),
      currentUsages: z.number().optional(),
      code: z.string(),
      bypassVerification: z.boolean().optional(),
      bypassPayment: z.boolean().optional(),
      cardValidityTerm: z.number().optional(),
      description: z.string().optional(),
      createdDate: z.string().datetime().optional(),
      lastUpdatedDate: z.string().datetime().optional(),
      active: z.boolean().optional(),
      used: z.boolean().optional(),
      addedDate: z.string().datetime().optional(),
      usedDate: z.string().datetime().optional(),
    })
    .transform((promoCode) => ({
      parentUuid: promoCode.pk.replace('PROMO_CODE#', ''),
      promoCodeType: promoCode.sk.includes('#')
        ? promoCode.sk.substring(0, promoCode.sk.indexOf('#'))
        : promoCode.sk,
      singleCodeUuid: promoCode.sk.includes('#')
        ? promoCode.sk.substring(promoCode.sk.indexOf('#') + 1)
        : undefined,
      name: promoCode.name,
      validityStartDate: promoCode.validityStartDate
        ? transformDateToFormatYYYYMMDD(promoCode.validityStartDate)
        : undefined,
      validityEndDate: promoCode.validityEndDate
        ? transformDateToFormatYYYYMMDD(promoCode.validityEndDate)
        : undefined,
      codeProvider: promoCode.codeProvider,
      maxUsages: promoCode.maxUsages,
      currentUsages: promoCode.currentUsages,
      code: promoCode.code,
      bypassVerification: promoCode.bypassVerification,
      bypassPayment: promoCode.bypassPayment,
      cardValidityTerm: promoCode.cardValidityTerm,
      description: promoCode.description,
      createdDate: promoCode.createdDate
        ? transformDateToFormatYYYYMMDD(promoCode.createdDate)
        : undefined,
      lastUpdatedDate: promoCode.lastUpdatedDate
        ? transformDateToFormatYYYYMMDD(promoCode.lastUpdatedDate)
        : undefined,
      active: promoCode.active,
      used: promoCode.used,
      addedDate: promoCode.addedDate
        ? transformDateToFormatYYYYMMDD(promoCode.addedDate)
        : undefined,
      usedDate: promoCode.usedDate ? transformDateToFormatYYYYMMDD(promoCode.usedDate) : undefined,
    })),
);

export type PromoCodeModel = z.infer<typeof PromoCodeModel>;
