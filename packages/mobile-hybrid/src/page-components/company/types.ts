import { OfferTypeStrLiterals, offerTypeParser } from '@bluelightcard/shared-ui';
import { PortableTextBlock } from '@portabletext/types';
import { z } from 'zod';

// Model
export type OfferModel = {
  id: number;
  description: string;
  name: string;
  type: OfferTypeStrLiterals;
  expiry: string;
  terms: string;
  image: string;
};

export type CMSOfferModel = {
  id: string;
  description: PortableTextBlock;
  name: string;
  type: OfferTypeStrLiterals;
  expires: string;
  termsAndConditions: PortableTextBlock;
  image: string | null;
};

export type CompanyModel = {
  companyId: number | string;
  companyName: string;
  companyDescription: string | PortableTextBlock;
  offers: OfferModel[] | CMSOfferModel[];
};

// Zod Types
export const ZodCompanyModel = z.object({
  description: z.any(), // TODO: Fix this any type
  name: z.string(),
  id: z.union([z.string(), z.number()]),
});

export const ZodOfferModel = z.object({
  id: z.number(),
  description: z.string(),
  name: z.string(),
  type: z.string(),
  expiry: z.string(),
  terms: z.string(),
  image: z.string(),
});

export const ZodOfferResponseModel = z.object({
  message: z.string(),
  data: z.object({
    offers: z.array(ZodOfferModel),
  }),
});

export const CMSZodOfferResponseModel = z.array(
  z.object({
    id: z.string(),
    description: z.any(), // TODO: Fix this any type
    name: z.string(),
    type: z.string(),
    expires: z.string(),
    termsAndConditions: z.any(), // TODO: Fix this any type
    image: z.string().nullable(),
  }),
);

export const ZodCompanyResponseModel = z.object({
  message: z.string(),
  data: ZodCompanyModel,
});

// Pill/Filter types
export type filtersType = 'All' | keyof typeof offerTypeParser;
