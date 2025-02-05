import { z } from 'zod';
import { IdType } from './enums/IdType';
import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const SupportedDocumentModel = createZodNamedType(
  'IdRequirementsModel',
  z.object({
    idKey: z.string(),
    type: z.nativeEnum(IdType),
    title: z.string(),
    guidelines: z.string(),
    description: z.string(),
    required: z.boolean().default(false),
  }),
);
export type SupportedDocumentModel = z.infer<typeof SupportedDocumentModel>;

export const IdRequirementsModel = createZodNamedType(
  'IdRequirementsModel',
  z.object({
    minimumRequired: z.number().default(1),
    supportedDocuments: z.array(SupportedDocumentModel),
  }),
);
export type IdRequirementsModel = z.infer<typeof IdRequirementsModel>;

export const GetIdRequirementDocsModel = createZodNamedType(
  'GetIdRequirementDocsModel',
  SupportedDocumentModel.pick({
    idKey: true,
    type: true,
    description: true,
  }),
);
export type GetIdRequirementDocsModel = z.infer<typeof GetIdRequirementDocsModel>;
