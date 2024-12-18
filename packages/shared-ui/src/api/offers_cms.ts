import type {
  V2ApisGetEventResponse,
  V2ApisGetOfferResponse,
  V2CompaniesGetCompanyOffersResponse,
  V2CompaniesGetCompanyResponse,
} from '@blc-mono/offers-cms/api';
import type { IPlatformAdapter } from '../adapters';
import { getBrandedOffersPath } from '../utils/pathUtils';

export async function cms_GetOffer(adapter: IPlatformAdapter, offerId: string) {
  const result = await adapter.invokeV5Api(`${getBrandedOffersPath(true)}/offers/${offerId}`, {
    method: 'GET',
  });

  if (result.status !== 200) {
    throw new Error(result.status === 404 ? 'Offer not found' : 'Unable to retrieve offer details');
  }

  return JSON.parse(result.data) as V2ApisGetOfferResponse;
}

export async function cms_GetEvent(adapter: IPlatformAdapter, eventId: string) {
  const result = await adapter.invokeV5Api(`${getBrandedOffersPath(true)}/events/${eventId}`, {
    method: 'GET',
  });

  if (result.status !== 200) {
    throw new Error(result.status === 404 ? 'Event not found' : 'Unable to retrieve Event details');
  }

  return JSON.parse(result.data) as V2ApisGetEventResponse;
}

export async function cms_GetCompany(adapter: IPlatformAdapter, companyId: string) {
  const result = await adapter.invokeV5Api(`${getBrandedOffersPath(true)}/companies/${companyId}`, {
    method: 'GET',
  });

  if (result.status !== 200) {
    throw new Error(
      result.status === 404 ? 'Company not found' : 'Unable to retrieve company details',
    );
  }

  return JSON.parse(result.data) as V2CompaniesGetCompanyResponse;
}

export async function cms_GetOffersByCompany(adapter: IPlatformAdapter, companyId: string) {
  const result = await adapter.invokeV5Api(
    `${getBrandedOffersPath(true)}/companies/${companyId}/offers`,
    {
      method: 'GET',
    },
  );

  if (result.status !== 200) {
    if (result.status === 404) {
      return [] as V2CompaniesGetCompanyOffersResponse;
    }
    throw new Error('Unable to retrieve company offers');
  }

  return JSON.parse(result.data) as V2CompaniesGetCompanyOffersResponse;
}
