import { z } from 'zod';
import { ApplicationReason } from './enums/ApplicationReason';
import { RejectionReason } from './enums/RejectionReason';
import { EligibilityStatus } from './enums/EligibilityStatus';
import { PaymentStatus } from './enums/PaymentStatus';
import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';
import { ReorderCardReason } from '@blc-mono/shared/models/members/enums/ReorderCardReason';

export const ApplicationModel = createZodNamedType(
  'ApplicationModel',
  z.object({
    memberId: z.string().uuid(),
    applicationId: z.string().uuid(),
    startDate: z.string().datetime().optional(),
    eligibilityStatus: z.nativeEnum(EligibilityStatus).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
    purchaseDate: z.string().datetime().optional(),
    applicationReason: z.nativeEnum(ApplicationReason).nullable(),
    reorderCardReason: z.nativeEnum(ReorderCardReason).optional(),
    verificationMethod: z.string().optional(),
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    postcode: z.string().optional(),
    country: z.string().optional(),
    promoCode: z.string().nullable().optional(),
    documents: z.array(z.string()).optional(),
    documentsUploadedDate: z.string().datetime().optional(),
    promoCodeApplied: z.boolean().optional(),
    trustedDomainEmail: z.string().optional(),
    trustedDomainValidated: z.boolean().optional(),
    nameChangeReason: z.string().nullable().optional(),
    nameChangeFirstName: z.string().nullable().optional(),
    nameChangeLastName: z.string().nullable().optional(),
    nameChangeDocType: z.string().nullable().optional(),
    rejectionReason: z.nativeEnum(RejectionReason).nullable().optional(),
    assignedTo: z.string().uuid().nullable().optional(),
    cardNumber: z.string().optional(),
    ingestionLastTriggered: z.string().datetime().optional(),
    trustedDomainVerificationUid: z.string().optional(),
  }),
);
export type ApplicationModel = z.infer<typeof ApplicationModel>;

export const CreateApplicationModel = createZodNamedType(
  'CreateApplicationModel',
  ApplicationModel.pick({
    startDate: true,
    eligibilityStatus: true,
    applicationReason: true,
    reorderCardReason: true,
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
    applicationReason: true,
  }),
);
export type UpdateApplicationModel = z.infer<typeof UpdateApplicationModel>;

export const RejectApplicationModel = createZodNamedType(
  'RejectApplicationModel',
  z.object({
    rejectionReason: z.nativeEnum(RejectionReason),
  }),
);
export type RejectApplicationModel = z.infer<typeof RejectApplicationModel>;

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
