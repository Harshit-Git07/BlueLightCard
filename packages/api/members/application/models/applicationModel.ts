import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { ApplicationReason } from './enums/ApplicationReason';
import { RejectionReason } from './enums/RejectionReason';

export const ApplicationModel = createZodNamedType(
  'ApplicationModel',
  z.object({
    memberId: z.string().uuid(),
    applicationId: z.string().uuid(),
    startDate: z.string().date().optional(),
    eligibilityStatus: z.string().optional(),
    applicationReason: z.nativeEnum(ApplicationReason).nullable(),
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
    rejectionReason: z.nativeEnum(RejectionReason).nullable().optional(),
  }),
);

export type ApplicationModel = z.infer<typeof ApplicationModel>;

export const CreateApplicationModel = createZodNamedType(
  'CreateApplicationModel',
  ApplicationModel.pick({
    memberId: true,
    startDate: true,
    eligibilityStatus: true,
    applicationReason: true,
  }),
);
export type CreateApplicationModel = z.infer<typeof CreateApplicationModel>;

export const UpdateApplicationModel = createZodNamedType(
  'UpdateApplicationModel',
  ApplicationModel.omit({
    idS3LocationPrimary: true,
    idS3LocationSecondary: true,
    applicationReason: true,
  }),
);
export type UpdateApplicationModel = z.infer<typeof UpdateApplicationModel>;
