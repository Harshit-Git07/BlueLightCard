import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { EligibilityStatus } from '../../enums/EligibilityStatus';

export const CustomerApplicationModel = createZodNamedType(
  'CustomerApplicationModel',
  z
    .object({
      startDate: z
        .string()
        .optional()
        .nullable()
        .transform((val) => (val ? new Date(val) : null)),
      eligibilityStatus: z.nativeEnum(EligibilityStatus).nullable().optional(),
      applicationReason: z.string().nullable().optional(),
      verificationMethod: z.string().nullable().optional(),
      address1: z.string().nullable().optional(),
      address2: z.string().nullable().optional(),
      city: z.string().nullable().optional(),
      postCode: z.string().nullable().optional(),
      country: z.string().nullable().optional(),
      promoCode: z.string().nullable().optional(),
      trustedDomainEmail: z.string().nullable().optional(),
      trustedDomainVerified: z.boolean().nullable().optional(),
      rejectionReason: z.string().nullable().optional(),
    })
    .transform((application) => ({
      startDate: application.startDate,
      eligibilityStatus: application.eligibilityStatus,
      applicationReason: application.applicationReason,
      verificationMethod: application.verificationMethod,
      address1: application.address1,
      address2: application.address2,
      city: application.city,
      postcode: application.postCode,
      country: application.country,
      promoCode: application.promoCode,
      trustedDomainEmail: application.trustedDomainEmail,
      trustedDomainVerified: application.trustedDomainVerified,
      rejectionReason: application.rejectionReason,
    })),
);

export type CustomerApplicationModel = z.infer<typeof CustomerApplicationModel>;
