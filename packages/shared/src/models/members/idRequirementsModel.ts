import { z } from 'zod';
import { IdType } from './enums/IdType';
import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const IdRequirementModel = createZodNamedType(
  'IdRequirementModel',
  z.object({
    idKey: z.string(),
    type: z.nativeEnum(IdType),
    description: z.string().optional(),
  }),
);
export type IdRequirementModel = z.infer<typeof IdRequirementModel>;
