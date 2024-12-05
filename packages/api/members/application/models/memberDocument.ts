import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const MemberDocumentModel = createZodNamedType(
  'MemberDocumentModel',
  z.object({
    memberId: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    emailAddress: z.string().optional(),
    signupDate: z.string().optional(),
    organisationId: z.string().optional(),
    employerId: z.string().optional(),
    userStatus: z.string().optional(),
    applicationId: z.string().optional(),
    startDate: z.string().optional(),
    eligibilityStatus: z.string().optional(),
    paymentStatus: z.string().optional(),
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cardStatus: z.string().optional(),
  }),
);

export type MemberDocumentModel = z.infer<typeof MemberDocumentModel>;
