import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';
import { EmploymentStatus } from './enums/EmploymentStatus';
import { IdType } from './enums/IdType';

export const EmployerModel = createZodNamedType(
  'EmployerModel',
  z.object({
    organisationId: z.string().uuid(),
    employerId: z.string().uuid(),
    name: z.string(),
    type: z.string().nullable().optional(),
    active: z.boolean().default(true),
    employmentStatus: z.array(z.nativeEnum(EmploymentStatus)).optional(),
    employedIdRequirements: z
      .object({
        minimumRequired: z.number().default(1),
        supportedDocuments: z.array(
          z.object({
            idKey: z.string(),
            type: z.nativeEnum(IdType),
            title: z.string(),
            guidelines: z.string(),
            description: z.string(),
            required: z.boolean().default(false),
          }),
        ),
      })
      .optional(),
    retiredIdRequirements: z
      .object({
        minimumRequired: z.number().default(1),
        supportedDocuments: z.array(
          z.object({
            idKey: z.string(),
            type: z.nativeEnum(IdType),
            title: z.string(),
            guidelines: z.string(),
            description: z.string(),
            required: z.boolean().default(false),
          }),
        ),
      })
      .optional(),
    volunteerIdRequirements: z
      .object({
        minimumRequired: z.number().default(1),
        supportedDocuments: z.array(
          z.object({
            idKey: z.string(),
            type: z.nativeEnum(IdType),
            title: z.string(),
            guidelines: z.string(),
            description: z.string(),
            required: z.boolean().default(false),
          }),
        ),
      })
      .optional(),
    idUploadCount: z.number().default(0).optional(),
    trustedDomains: z.array(z.string()).default([]).optional(),
    bypassPayment: z.boolean().default(false).optional(),
    bypassId: z.boolean().default(false).optional(),
    lastUpdated: z.string().optional(),
  }),
);

export type EmployerModel = z.infer<typeof EmployerModel>;

export const CreateEmployerModel = createZodNamedType(
  'CreateEmployerModel',
  EmployerModel.omit({
    organisationId: true,
    employerId: true,
    idUploadCount: true,
    lastUpdated: true,
  }),
);
export type CreateEmployerModel = z.infer<typeof CreateEmployerModel>;

export const CreateEmployerResponseModel = createZodNamedType(
  'CreateEmployerResponseModel',
  z.object({
    organisationId: z.string().uuid(),
    employerId: z.string().uuid(),
  }),
);
export type CreateEmployerResponseModel = z.infer<typeof CreateEmployerResponseModel>;

export const UpdateEmployerModel = createZodNamedType(
  'UpdateEmployerModel',
  EmployerModel.omit({
    organisationId: true,
    employerId: true,
    idUploadCount: true,
    lastUpdated: true,
  }),
);
export type UpdateEmployerModel = z.infer<typeof UpdateEmployerModel>;

export const IdRequirementsModel = createZodNamedType(
  'IdRequirementsModel',
  z.object({
    minimumRequired: z.number().default(1),
    supportedDocuments: z.array(
      z.object({
        idKey: z.string(),
        type: z.nativeEnum(IdType),
        title: z.string(),
        guidelines: z.string(),
        description: z.string(),
        required: z.boolean().default(false),
      }),
    ),
  }),
);

export type IdRequirementsModel = z.infer<typeof IdRequirementsModel>;

export const SupportedDocumentModel = createZodNamedType(
  'SupportedDocumentModel',
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
