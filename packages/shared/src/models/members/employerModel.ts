import { z } from 'zod';
import { EmploymentStatus } from './enums/EmploymentStatus';
import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';
import { IdRequirementsModel } from '@blc-mono/shared/models/members/idRequirementsModel';

export const EmployerModel = createZodNamedType(
  'EmployerModel',
  z.object({
    organisationId: z.string().uuid(),
    employerId: z.string().uuid(),
    name: z.string(),
    type: z.string().nullable().optional(),
    active: z.boolean().default(true),
    trustedDomains: z.preprocess((val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch (error) {
          return [];
        }
      }
      return val;
    }, z.array(z.string()).default([])),
    employmentStatus: z.array(z.nativeEnum(EmploymentStatus)).optional(),
    employedIdRequirements: IdRequirementsModel.optional(),
    retiredIdRequirements: IdRequirementsModel.optional(),
    volunteerIdRequirements: IdRequirementsModel.optional(),
    isJobTitleMandatory: z.boolean().default(true).optional(),
    isJobReferenceMandatory: z.boolean().default(false).optional(),
    idUploadCount: z.number().default(0).optional(),
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
