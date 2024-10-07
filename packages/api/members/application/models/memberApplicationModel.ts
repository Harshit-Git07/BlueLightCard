import { z } from 'zod';
import { transformDateToFormatYYYYMMDD } from '@blc-mono/core/utils/date';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { ApplicationReason } from '../enums/ApplicationReason';

export const MemberApplicationModel = createZodNamedType(
  'MemberApplicationModel',
  z
    .object({
      pk: z.string().startsWith('MEMBER#'),
      sk: z.string().startsWith('APPLICATION#'),
      startDate: z.string().datetime(),
      eligibilityStatus: z.string(),
      applicationReason: z.nativeEnum(ApplicationReason).nullable(),
      verificationMethod: z.string(),
      address1: z.string(),
      address2: z.string(),
      city: z.string(),
      postcode: z.string(),
      country: z.string(),
      promoCode: z.string().nullable(),
      idS3LocationPrimary: z.string(),
      idS3LocationSecondary: z.string(),
      trustedDomainEmail: z.string(),
      trustedDomainValidated: z.boolean(),
      nameChangeReason: z.string().nullable(),
      nameChangeFirstName: z.string().nullable(),
      nameChangeLastName: z.string().nullable(),
      nameChangeDocType: z.string().nullable(),
      rejectionReason: z.string().nullable(),
    })
    .transform((application) => ({
      memberUuid: application.pk.replace('MEMBER#', ''),
      applicationUuid: application.sk.replace('APPLICATION#', ''),
      startDate: transformDateToFormatYYYYMMDD(application.startDate),
      eligibilityStatus: application.eligibilityStatus,
      applicationReason: application.applicationReason,
      verificationMethod: application.verificationMethod,
      address1: application.address1,
      address2: application.address2,
      city: application.city,
      postcode: application.postcode,
      country: application.country,
      promoCode: application.promoCode,
      idS3LocationPrimary: application.idS3LocationPrimary,
      idS3LocationSecondary: application.idS3LocationSecondary,
      trustedDomainEmail: application.trustedDomainEmail,
      trustedDomainValidated: application.trustedDomainValidated,
      nameChangeReason: application.nameChangeReason,
      nameChangeFirstName: application.nameChangeFirstName,
      nameChangeLastName: application.nameChangeLastName,
      nameChangeDocType: application.nameChangeDocType,
      rejectionReason: application.rejectionReason,
    })),
);

export type MemberApplicationModel = z.infer<typeof MemberApplicationModel>;
