import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const ApprovalAllocationModel = createZodNamedType(
  'ApprovalAllocationModel',
  z.object({
    applicationIds: z.string().uuid().array(),
  }),
);

export type ApprovalAllocationModel = z.infer<typeof ApprovalAllocationModel>;
