import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';

export const EmployerModel = createZodNamedType(
  'EmployerModel',
  z
    .object({
      sk: z.string().startsWith('EMPLOYER#'),
      name: z.string(),
      type: z.string().default(''),
      active: z.string().default('TRUE'),
      volunteers: z.string().nullable(),
      retired: z.string().nullable(),
      idRequirements: z
        .array(
          z.object({
            id: z.string(),
            title: z.string(),
            criteria: z.array(z.string()),
            allowedFormats: z.string(),
          }),
        )
        .default([]),
      trustedDomains: z.array(z.string()).default([]),
    })
    .transform((employer) => ({
      employerId: employer.sk.replace('EMPLOYER#', ''),
      name: employer.name,
      type: employer.type,
      active: employer.active === 'TRUE',
      volunteer: employer.volunteers === 'TRUE',
      retired: employer.retired === 'TRUE',
      idRequirements: JSON.stringify(employer.idRequirements),
      trustedDomains: employer.trustedDomains,
    })),
);

export type EmployerModel = z.infer<typeof EmployerModel>;
