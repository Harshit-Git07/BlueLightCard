import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { ApplicationReason } from './enums/ApplicationReason';
import { RejectionReason } from './enums/RejectionReason';
import { EligibilityStatus } from './enums/EligibilityStatus';
import { PaymentStatus } from '@blc-mono/members/application/models/enums/PaymentStatus';

export const ApplicationModel = createZodNamedType(
  'ApplicationModel',
  z.object({
    memberId: z.string().uuid(),
    applicationId: z.string().uuid(),
    startDate: z.string().date().optional(),
    eligibilityStatus: z.nativeEnum(EligibilityStatus).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
    purchaseDate: z.string().datetime().optional(),
    applicationReason: z.nativeEnum(ApplicationReason).optional(),
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    postcode: z.string().optional(),
    country: z.string().optional(),
    promoCode: z.string().nullable().optional(),
    promoCodeApplied: z.boolean().optional(),
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
    startDate: true,
    eligibilityStatus: true,
    applicationReason: true,
  }),
);
export type CreateApplicationModel = z.infer<typeof CreateApplicationModel>;

export const CreateApplicationModelResponse = createZodNamedType(
  'CreateApplicationModelResponse',
  z.object({
    applicationId: z.string().uuid(),
  }),
);
export type CreateApplicationModelResponse = z.infer<typeof CreateApplicationModelResponse>;

export const UpdateApplicationModel = createZodNamedType(
  'UpdateApplicationModel',
  ApplicationModel.omit({
    memberId: true,
    applicationId: true,
    idS3LocationPrimary: true,
    idS3LocationSecondary: true,
    applicationReason: true,
  }),
);
export type UpdateApplicationModel = z.infer<typeof UpdateApplicationModel>;

export const ApplyPromoCodeApplicationModel = createZodNamedType(
  'ApplyPromoCodeApplicationModel',
  ApplicationModel.pick({
    promoCode: true,
    promoCodeApplied: true,
    eligibilityStatus: true,
    paymentStatus: true,
    purchaseDate: true,
  }),
);
export type ApplyPromoCodeApplicationModel = z.infer<typeof ApplyPromoCodeApplicationModel>;
