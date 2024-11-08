import { type RichtextModule } from '@bluelightcard/sanity-types';
import { z } from '@hono/zod-openapi';

function schemaForType<T>() {
  return (schema: z.ZodTypeAny) => schema as z.ZodType<T>;
}

export const richtextModule = schemaForType<RichtextModule | null>()(
  z
    .unknown()
    .nullable()
    .openapi({
      format: 'PortableText',
      externalDocs: {
        url: 'https://www.sanity.io/docs/presenting-block-text',
        description: 'Sanity Docs',
      },
    }),
);

export const CompanySchema = z.object({
  id: z.string().openapi({
    description: 'Company ID',
    example: '123456',
  }),
  name: z.string().openapi({
    description: 'Company Name',
    example: 'Epic Games',
  }),
  description: z
    .any()
    .nullable()
    .openapi({
      format: 'PortableText',
      externalDocs: {
        url: 'https://www.sanity.io/docs/presenting-block-text',
        description: 'Sanity Docs',
      },
    }),
});

export const OfferSchema = z.object({
  id: z.string().openapi({
    description: 'Offer ID',
    example: '123456',
  }),
  name: z.string().openapi({
    description: 'Company Name',
    example: '20% off all Fortnite skins',
  }),
  description: richtextModule,
  type: z.enum(['gift-card', 'in-store', 'local', 'online', 'ticket', 'other']).openapi({
    description: 'Type of offer',
    example: 'gift-card',
  }),
  expires: z.string().nullable().openapi({
    description: 'Date the offer expires ',
  }),
  termsAndConditions: richtextModule,
  image: z.string().nullable().openapi({
    description: 'Offer image',
  }),
  companyId: z.string().nullable().openapi({
    description: 'Company ID',
  }),
});

export type Offer = z.infer<typeof OfferSchema>;
