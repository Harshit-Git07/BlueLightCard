import { z } from 'zod';

export const UpdateCompanyModel = z.object({
  legacyId: z.number().optional(),
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  email: z.string().optional(),
  phone: z.string().optional(),
  contactName: z.string().optional(),
  contactPosition: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
  tradeRegion: z.string().optional(),
  postCode: z.string().optional(),
  maximumOfferCount: z.number().optional(),
  building: z.string().optional(),
  street: z.string().optional(),
  county: z.string().optional(),
  townCity: z.string().optional(),
  country: z.string().optional(),
  eagleEyeId: z.number().optional(),
  affiliateNetworkId: z.string().optional(),
  affiliateMerchantId: z.string().optional(),
  isAgeGated: z.boolean().optional(),
});

export const IsApprovedModel = z.object({
  legacyCompanyId: z.number({
    required_error: 'legacyCompanyId is required',
    invalid_type_error: 'legacyCompanyId must be a number',
  }),
  isApproved: z.boolean({
    required_error: 'isApproved is required',
    invalid_type_error: 'isApproved must be a boolean',
  }),
});

export const CompanySmallLogoModel = z.object({
  legacyCompanyId: z.number({
    required_error: 'legacyCompanyId is required',
    invalid_type_error: 'legacyCompanyId must be a number',
  }),
  smallLogo: z.string({
    required_error: 'companySmallLogo is required',
    invalid_type_error: 'companySmallLogo must be a string',
  }),
});

export const CompanyLargeLogoModel = z.object({
  legacyCompanyId: z.number({
    required_error: 'legacyCompanyId is required',
    invalid_type_error: 'legacyCompanyId must be a number',
  }),
  largeLogo: z.string({
    required_error: 'companySmallLogo is required',
    invalid_type_error: 'companySmallLogo must be a string',
  }),
});

export const CompanyBothLogosModel = z.object({
  legacyCompanyId: z.number({
    required_error: 'legacyCompanyId is required',
    invalid_type_error: 'legacyCompanyId must be a number',
  }),
  smallLogo: z.string({
    required_error: 'companySmallLogo is required',
    invalid_type_error: 'companySmallLogo must be a string',
  }),
  largeLogo: z.string({
    required_error: 'companySmallLogo is required',
    invalid_type_error: 'companySmallLogo must be a string',
  }),
});

export type UpdateCompanyDetails = z.infer<typeof UpdateCompanyModel>;
export type IsApproved = z.infer<typeof IsApprovedModel>;
export type CompanySmallLogo = z.infer<typeof CompanySmallLogoModel>;
export type CompanyLargeLogo = z.infer<typeof CompanyLargeLogoModel>;
export type CompanyBothLogos = z.infer<typeof CompanyBothLogosModel>;
