import { OfferTypeStrLiterals, offerTypeParser } from '@bluelightcard/shared-ui';
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
  description: any; // TODO: Fix this any type
  name: string;
  type: OfferTypeStrLiterals;
  expires: string;
  termsAndConditions: any; // TODO: Fix this any type
  image: string;
};

export type CompanyModel = {
  companyId: number;
  companyName: string;
  companyDescription: any; // TODO: Fix this any type (can be string or any)
  offers: OfferModel[] | CMSOfferModel[];
};

// Zod Types
export const ZodCompanyModel = z.object({
  description: z.any(), // TODO: Fix this any type
  name: z.string(),
  id: z.any(), // TODO: Fix this any type (can be string or number)
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
    image: z.string(),
  }),
);

export const ZodCompanyResponseModel = z.object({
  message: z.string(),
  data: ZodCompanyModel,
});

// Pill/Filter types
export type filtersType = 'All' | keyof typeof offerTypeParser;
