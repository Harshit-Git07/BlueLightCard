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

export type CompanyModel = {
  companyId: number;
  companyName: string;
  companyDescription: string;
  offers: OfferModel[];
};

// Zod Types
export const ZodCompanyModel = z.object({
  description: z.string(),
  name: z.string(),
  id: z.number(),
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

export const ZodCompanyResponseModel = z.object({
  message: z.string(),
  data: ZodCompanyModel,
});

// Pill/Filter types
export type filtersType = 'All' | keyof typeof offerTypeParser;
