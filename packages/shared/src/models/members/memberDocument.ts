import { z } from 'zod';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const MemberDocumentModel = createZodNamedType(
  'MemberDocumentModel',
  z.object({
    memberId: z.string().uuid(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    signupDate: z.string().datetime().optional(),
    organisationId: z.string().uuid().optional(),
    organisationName: z.string().optional(),
    employerId: z.string().uuid().optional(),
    employerName: z.string().optional(),
    userStatus: z.string().optional(),
    applicationId: z.string().uuid().optional(),
    startDate: z.string().date().optional(),
    eligibilityStatus: z.nativeEnum(EligibilityStatus).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
    cardNumber: z.string().optional(),
    expiryDate: z.string().datetime().optional(),
    cardStatus: z.nativeEnum(CardStatus).optional(),
  }),
);

export type MemberDocumentModel = z.infer<typeof MemberDocumentModel>;

export const MemberDocumentsSearchModel = createZodNamedType(
  'MemberDocumentsSearchModel',
  z.object({
    pageIndex: z.number(),
    memberId: z.string().uuid().optional(),
    organisationId: z.string().uuid().optional(),
    employerId: z.string().uuid().optional(),
    applicationId: z.string().uuid().optional(),
    userStatus: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    cardNumber: z.string().optional(),
    signupDateStart: z.string().datetime().optional(),
    signupDateEnd: z.string().datetime().optional(),
    eligibilityStatus: z.nativeEnum(EligibilityStatus).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
    cardStatus: z.nativeEnum(CardStatus).optional(),
  }),
);

export type MemberDocumentsSearchModel = z.infer<typeof MemberDocumentsSearchModel>;

export const MemberDocumentsSearchResponseModel = createZodNamedType(
  'MemberDocumentsSearchResponseModel',
  z.object({
    totalResults: z.number(),
    pageNumber: z.number(),
    results: z.array(MemberDocumentModel),
  }),
);

export type MemberDocumentsSearchResponseModel = z.infer<typeof MemberDocumentsSearchResponseModel>;
