import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { BatchType } from '@blc-mono/members/application/models/enums/BatchType';
import { BatchStatus } from '@blc-mono/members/application/models/enums/BatchStatus';

export const BatchModel = createZodNamedType(
  'BatchModel',
  z.object({
    batchId: z.string().uuid(),
    name: z.string(),
    type: z.nativeEnum(BatchType).optional(),
    createdDate: z.string().datetime().optional(),
    sentDate: z.string().datetime().optional(),
    receivedDate: z.string().datetime().optional(),
    closedDate: z.string().datetime().optional(),
    count: z.number().optional(),
    status: z.nativeEnum(BatchStatus).nullable().optional(),
  }),
);
export type BatchModel = z.infer<typeof BatchModel>;

export const CreateBatchModel = createZodNamedType(
  'CreateBatchModel',
  BatchModel.pick({
    name: true,
    type: true,
    count: true,
  }),
);

export type CreateBatchModel = z.infer<typeof CreateBatchModel>;

export const UpdateBatchModel = createZodNamedType(
  'UpdateBatchModel',
  BatchModel.omit({
    batchId: true,
    name: true,
    type: true,
    createdDate: true,
    count: true,
  }),
);
export type UpdateBatchModel = z.infer<typeof UpdateBatchModel>;
export const CreateInternalBatchModel = createZodNamedType(
  'CreateInternalBatchModelRequest',
  z.object({
    name: z.string(),
    cardNumbers: z.string().array(),
  }),
);

export type CreateInternalBatchModel = z.infer<typeof CreateInternalBatchModel>;

export const CreateInternalBatchModelResponse = createZodNamedType(
  'CreateInternalBatchModelResponse',
  BatchModel.pick({
    batchId: true,
  }),
);

export type CreateInternalBatchModelResponse = z.infer<typeof CreateInternalBatchModelResponse>;
