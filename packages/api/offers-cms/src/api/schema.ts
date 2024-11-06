import { z } from '@hono/zod-openapi';

const RichtextModuleSchema = (description: string) =>
  z
    .any()
    .nullable()
    .openapi({
      description,
      format: 'PortableText',
      externalDocs: {
        url: 'https://www.sanity.io/docs/presenting-block-text',
        description: 'Sanity Docs',
      },
      example:
        'Save 20% off every single Fortnite skin. Adorn a new look and take on the competition in style!',
    });

export const CompanySchema = z.object({
  id: z.string().openapi({
    description: 'Company ID',
    example: '123456',
  }),
  name: z.string().openapi({
    description: 'Company Name',
    example: 'Epic Games',
  }),
  description: RichtextModuleSchema('Description of company'),
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
  description: RichtextModuleSchema('Description of offer'),
  type: z.enum(['gift-card', 'in-store', 'local', 'online', 'ticket', 'other']).openapi({
    description: 'Type of offer',
    example: 'gift-card',
  }),
  expires: z.string().nullable().openapi({
    description: 'Date the offer expires ',
  }),
  termsAndConditions: RichtextModuleSchema('terms and conditions of offer'),
  image: z.string().nullable().openapi({
    description: 'Offer image',
  }),
  companyId: z.string().nullable().openapi({
    description: 'Company ID',
  }),
});

export type Offer = z.infer<typeof OfferSchema>;
