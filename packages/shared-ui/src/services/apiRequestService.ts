import { HttpMethod, IPlatformAdapter } from '../adapters';
import { z } from 'zod';

export enum CMS_SERVICES {
  COMPANY_DATA = 'COMPANY_DATA',
  OFFER_DETAILS_DATA = 'OFFER_DETAILS_DATA',
  OFFERS_BY_COMPANY_DATA = 'OFFERS_BY_COMPANY_DATA',
}

type Endpoints = {
  [key in CMS_SERVICES]: string;
};

type ApiDynamicPathParam = {
  service: CMS_SERVICES;
  isCmsFlagOn: boolean;
  companyId?: string | number;
  offerId?: string | number;
};

type ApiRequestParams = {
  adapter: IPlatformAdapter;
  isCmsFlagOn: boolean;
  method?: HttpMethod;
} & (
  | {
      // companyId value mandatory for COMPANY_DATA and OFFERS_BY_COMPANY_DATA
      service: CMS_SERVICES.COMPANY_DATA | CMS_SERVICES.OFFERS_BY_COMPANY_DATA;
      companyId: string | number;
      offerId?: string | number;
    }
  | {
      // offerId value mandatory for OFFER_DETAILS_DATA
      service: CMS_SERVICES.OFFER_DETAILS_DATA;
      offerId: string | number;
      companyId?: string | number;
    }
);

export const OfferDataSchema = z.object({
  id: z.number(),
  companyId: z.number(),
  companyLogo: z.string(),
  description: z.string(),
  expiry: z.string(),
  name: z.string(),
  terms: z.string(),
  type: z.string(),
  image: z.string(),
});

export const CMSOfferDataSchema = z.object({
  id: z.string(),
  description: z.any(), // TODO: Fix this any type
  expires: z.string(),
  name: z.string(),
  termsAndConditions: z.any(), // TODO: Fix this any type
  type: z.string(),
  image: z.string().nullable(),
});

export const CompanyOffersSchema = z.array(
  z.object({
    id: z.number(),
    description: z.string(),
    expiry: z.string(),
    name: z.string(),
    terms: z.string(),
    type: z.string(),
    image: z.string(),
  }),
);

export const CMSCompanyOffersSchema = z.array(
  z.object({
    id: z.string(),
    description: z.any(), // TODO: Fix this any type
    expires: z.string(),
    name: z.string(),
    termsAndConditions: z.any(), // TODO: Fix this any type
    type: z.string(),
    image: z.string().nullable(),
  }),
);

export const CompanyDataSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  description: z.any(), // TODO: Fix this any type
});

/* ---
  apiDynamicPath()
  Dynamic path generator for API requests to return V5 or CMS endpoints
--- */
export function apiDynamicPath({
  service,
  companyId,
  offerId,
  isCmsFlagOn = false,
}: ApiDynamicPathParam) {
  // ****
  // ALL ENDPOINTS FOR V5 AND CMS WILL BE LISTED BELOW
  // ****
  const v5Endpoints: Endpoints = {
    COMPANY_DATA: `/eu/offers/company/${companyId}`,
    OFFER_DETAILS_DATA: `/eu/offers/offers/${offerId}`,
    OFFERS_BY_COMPANY_DATA: `/eu/offers/company/${companyId}/offers`,
  };

  const cmsEndpoints: Endpoints = {
    COMPANY_DATA: `/eu/offers/v2/v2/companies/${companyId}`,
    OFFER_DETAILS_DATA: `/eu/offers/v2/v2/offers/${offerId}`,
    OFFERS_BY_COMPANY_DATA: `/eu/offers/v2/v2/companies/${companyId}/offers`,
  };

  if (!service) {
    throw new Error('Service not supported or not defined');
  }

  if (isCmsFlagOn) {
    return cmsEndpoints[service];
  }

  return v5Endpoints[service];
}

/* ---
  apiRequest()
  Function to fetch data from V5 or CMS API, based on the service provided
--- */
export async function apiRequest({
  service,
  adapter,
  isCmsFlagOn = false,
  method = 'GET',
  offerId,
  companyId,
}: ApiRequestParams) {
  // Switch statement to determine which service to call
  switch (service) {
    case CMS_SERVICES.COMPANY_DATA: {
      const result = await adapter.invokeV5Api(
        apiDynamicPath({
          service,
          companyId: companyId as string,
          isCmsFlagOn,
        }),
        {
          method,
        },
      );

      const resultData = JSON.parse(result.data);

      if (isCmsFlagOn) {
        return CompanyDataSchema.parse(resultData);
      }

      return CompanyDataSchema.parse(resultData.data);
    }

    case CMS_SERVICES.OFFER_DETAILS_DATA: {
      const result = await adapter.invokeV5Api(
        apiDynamicPath({
          service,
          offerId: offerId as string,
          isCmsFlagOn,
        }),
        {
          method,
        },
      );

      const resultData = JSON.parse(result.data);

      if (isCmsFlagOn) {
        return CMSOfferDataSchema.parse(resultData);
      }

      return OfferDataSchema.parse(resultData.data);
    }

    case CMS_SERVICES.OFFERS_BY_COMPANY_DATA: {
      const result = await adapter.invokeV5Api(
        apiDynamicPath({
          service,
          companyId: companyId as string,
          isCmsFlagOn,
        }),
        {
          method,
        },
      );

      const resultData = JSON.parse(result.data);

      if (isCmsFlagOn) {
        return CMSCompanyOffersSchema.parse(resultData);
      }

      return CompanyOffersSchema.parse(resultData.data.offers);
    }

    default:
      throw new Error('Service not supported or not defined');
  }
}
