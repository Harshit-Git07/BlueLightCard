import { z } from 'zod';
import { EmploymentStatus } from './enums/EmploymentStatus';
import { IdType } from './enums/IdType';
import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const OrganisationModel = createZodNamedType(
  'OrganisationModel',
  z.object({
    organisationId: z.string().uuid(),
    name: z.string(),
    type: z.string().nullable().optional(),
    active: z.boolean().default(true),
    trustedDomains: z.preprocess((val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val;
    }, z.array(z.string()).default([])),
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
    isSelfEmployed: z.boolean().default(false).optional(),
    isCustomEmployerName: z.boolean().default(false).optional(),
    idUploadCount: z.number().default(0).optional(),
    bypassPayment: z.boolean().default(false).optional(),
    bypassId: z.boolean().default(false).optional(),
    lastUpdated: z.string().optional(),
  }),
);
export type OrganisationModel = z.infer<typeof OrganisationModel>;

export const CreateOrganisationModel = createZodNamedType(
  'CreateOrganisationModel',
  OrganisationModel.omit({
    organisationId: true,
    idUploadCount: true,
    lastUpdated: true,
  }),
);
export type CreateOrganisationModel = z.infer<typeof CreateOrganisationModel>;

export const CreateOrganisationResponseModel = createZodNamedType(
  'CreateOrganisationResponseModel',
  z.object({
    organisationId: z.string().uuid(),
  }),
);
export type CreateOrganisationResponseModel = z.infer<typeof CreateOrganisationResponseModel>;

export const UpdateOrganisationModel = createZodNamedType(
  'UpdateOrganisationModel',
  OrganisationModel.omit({
    organisationId: true,
    idUploadCount: true,
    lastUpdated: true,
  }),
);
export type UpdateOrganisationModel = z.infer<typeof UpdateOrganisationModel>;
