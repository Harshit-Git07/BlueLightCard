import { z } from 'zod';
import { transformDateToFormatYYYYMMDD } from '@blc-mono/core/utils/date';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { ApplicationReason } from '../enums/ApplicationReason';

export const MemberApplicationModel = createZodNamedType(
  'MemberApplicationModel',
  z
    .object({
      pk: z
        .string()
        .refine((val) => val.startsWith('MEMBER#'), {
          message: 'pk must start with MEMBER#',
        })
        .refine(
          (val) => {
            const uuid = val.replace('MEMBER#', '');
            return z.string().uuid().safeParse(uuid).success;
          },
          {
            message: 'pk must be a valid UUID after MEMBER#',
          },
        ),
      sk: z
        .string()
        .refine((val) => val.startsWith('APPLICATION#'), {
          message: 'sk must start with APPLICATION#',
        })
        .refine(
          (val) => {
            const uuid = val.replace('APPLICATION#', '');
            return z.string().uuid().safeParse(uuid).success;
          },
          {
            message: 'sk must be a valid UUID after APPLICATION#',
          },
        ),
      startDate: z.string().datetime().optional(),
      eligibilityStatus: z.string().optional(),
      applicationReason: z.nativeEnum(ApplicationReason).nullable().optional(),
      verificationMethod: z.string().optional(),
      address1: z.string().optional(),
      address2: z.string().optional(),
      city: z.string().optional(),
      postcode: z.string().optional(),
      country: z.string().optional(),
      promoCode: z.string().nullable().optional(),
      idS3LocationPrimary: z.string().optional(),
      idS3LocationSecondary: z.string().optional(),
      trustedDomainEmail: z.string().optional(),
      trustedDomainValidated: z.boolean().optional(),
      nameChangeReason: z.string().nullable().optional(),
      nameChangeFirstName: z.string().nullable().optional(),
      nameChangeLastName: z.string().nullable().optional(),
      nameChangeDocType: z.string().nullable().optional(),
      rejectionReason: z.string().nullable().optional(),
    })
    .transform((application) => ({
      memberUuid: application.pk.replace('MEMBER#', ''),
      applicationUuid: application.sk.replace('APPLICATION#', ''),
      startDate: application.startDate
        ? transformDateToFormatYYYYMMDD(application.startDate)
        : undefined,
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
