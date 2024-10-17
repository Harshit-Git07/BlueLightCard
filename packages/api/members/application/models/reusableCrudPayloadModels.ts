import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const MemberApplicationExternalModel = createZodNamedType(
  'MemberApplicationExternalModel',
  z
    .object({
      pk: z.string().startsWith('MEMBER#'),
      sk: z.string().startsWith('APPLICATION#'),
      address1: z.string().optional(),
      address2: z.string().optional(),
      city: z.string().optional(),
      postcode: z.string().optional(),
      country: z.string().optional(),
      promoCode: z.string().nullable().optional(),
      trustedDomainEmail: z.string().optional(),
    })
    .strict()
    .transform((application) => ({
      memberUuid: application.pk.replace('MEMBER#', ''),
      applicationUuid: application.sk.replace('APPLICATION#', ''),
      address1: application.address1,
      address2: application.address2,
      city: application.city,
      postcode: application.postcode,
      country: application.country,
      promoCode: application.promoCode,
      trustedDomainEmail: application.trustedDomainEmail,
    })),
);

export type MemberApplicationExternalModel = z.infer<typeof MemberApplicationExternalModel>;
