import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';

export const EmployerModel = createZodNamedType(
  'EmployerModel',
  z.object({
    employerId: z.string().uuid(),
    name: z.string(),
    type: z.string().nullable().optional(),
    active: z.boolean().default(true),
    volunteers: z.boolean().default(false),
    retired: z.boolean().default(false),
    idRequirements: z
      .array(
        z.object({
          id: z.string(),
          title: z.string().optional(),
          description: z.string().optional(),
          criteria: z.array(z.string()).optional(),
          allowedFormats: z.string().optional(),
        }),
      )
      .default([])
      .nullable()
      .optional(),
    trustedDomains: z.array(z.string()).default([]),
  }),
);

export type EmployerModel = z.infer<typeof EmployerModel>;
