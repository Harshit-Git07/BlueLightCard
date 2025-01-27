import { z } from 'zod';
import { EligibilityStatus } from './enums/EligibilityStatus';
import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const ApplicationBatchModel = createZodNamedType(
  'ApplicationBatchModel',
  z.object({
    memberId: z.string().uuid(),
    applicationId: z.string().uuid(),
    organisationId: z.string().uuid(),
    employerId: z.string().uuid(),
    startDate: z.string().date(),
    eligibilityStatus: z.nativeEnum(EligibilityStatus).optional(),
  }),
);
export type ApplicationBatchModel = z.infer<typeof ApplicationBatchModel>;

export const ApplicationBatchApprovalModel = createZodNamedType(
  'ApplicationBatchApprovalModel',
  z.object({
    applicationIds: z.string().uuid().array().optional(),
    organisationId: z.string().uuid().optional(),
    employerId: z.string().uuid().optional(),
    allocationRemovalReason: z.string().optional(),
  }),
);
export type ApplicationBatchApprovalModel = z.infer<typeof ApplicationBatchApprovalModel>;
