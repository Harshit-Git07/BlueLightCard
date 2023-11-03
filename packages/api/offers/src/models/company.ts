import { z } from 'zod';

export const CompanyModel = z.object({
  id: z.string().optional(),
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
  largeLogo: z.string().optional(),
  smallLogo: z.string().optional(),
  url: z.string().optional(),
  isApproved: z.boolean({
    required_error: 'isApproved is required',
    invalid_type_error: 'isApproved must be a boolean',
  }),
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

export type Company = z.infer<typeof CompanyModel>;
