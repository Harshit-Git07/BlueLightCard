import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const OrganisationModel = createZodNamedType(
  'OrganisationModel',
  z.object({
    organisationId: z.string().uuid(),
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
      .default([]),
    trustedDomains: z.array(z.string()).default([]),
  }),
);

export type OrganisationModel = z.infer<typeof OrganisationModel>;
