import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const OrganisationModel = createZodNamedType(
  'OrganisationModel',
  z
    .object({
      pk: z.string().startsWith('ORGANISATION#'),
      name: z.string(),
      code: z.string().nullable(),
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
    .transform((organisation) => ({
      organisationId: organisation.pk.replace('ORGANISATION#', ''),
      name: organisation.name,
      type: organisation.code,
      active: organisation.active === 'TRUE',
      volunteer: organisation.volunteers === 'TRUE',
      retired: organisation.retired === 'TRUE',
      idRequirements: JSON.stringify(organisation.idRequirements),
      trustedDomains: organisation.trustedDomains,
    })),
);

export type OrganisationModel = z.infer<typeof OrganisationModel>;
