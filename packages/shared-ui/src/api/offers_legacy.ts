import { IPlatformAdapter } from '../adapters';
import { Offer as LegacyOffer } from '@blc/offers-legacy/models/offers';
import { CompanyOffers as LegacyCompanyOffers } from '@blc/offers-legacy/models/companyOffers';
import { Company as LegacyCompany } from '@blc/offers-legacy/models/company';
import type {
  V2ApisGetOfferResponse,
  V2CompaniesGetCompanyOffersResponse,
  V2CompaniesGetCompanyResponse,
} from '@blc-mono/offers-cms/api';
import { getBrandedOffersPath } from '../utils/pathUtils';

const offerTypeMap: { [key in LegacyOffer['type']]: V2ApisGetOfferResponse['type'] } = {
  Online: 'online',
  Cashback: 'other',
  Giftcards: 'gift-card',
  Popular: 'other',
  Featured: 'other',
  'Own Benefits': 'other',
  'In-store': 'in-store',
  'Local Offer': 'local',
  'Local Services': 'local',
} as const;

export async function legacy_GetOffer(adapter: IPlatformAdapter, offerId: string) {
  const result = await adapter.invokeV5Api(`${getBrandedOffersPath()}/offers/${offerId}`, {
    method: 'GET',
  });

  if (result.status !== 200) {
    throw new Error(result.status === 404 ? 'Offer not found' : 'Unable to retrieve offer details');
  }

  const data = JSON.parse(result.data).data as LegacyOffer;

  return {
    id: data.id.toString(),
    name: data.name,
    description: data.description
      ? {
          _type: 'richtext-module',
          content: [
            {
              _type: 'block',
              style: 'normal',
              markDefs: [],
              _key: 'df610d808744',
              children: [
                {
                  _type: 'span',
                  text: data.description,
                  marks: [],
                  _key: 'df610d8087440',
                },
              ],
            },
          ],
        }
      : null,
    type: offerTypeMap[data.type],
    expires: data.expiry as unknown as string,
    termsAndConditions: data.terms
      ? {
          _type: 'richtext-module',
          content: [
            {
              _type: 'block',
              style: 'normal',
              markDefs: [],
              _key: 'df610d808744',
              children: [
                {
                  _type: 'span',
                  text: data.terms,
                  marks: [],
                  _key: 'df610d8087440',
                },
              ],
            },
          ],
        }
      : null,
    image: data.image,
    companyId: data.companyId ? String(data.companyId) : null,
  } satisfies V2ApisGetOfferResponse;
}
export async function legacy_GetCompany(adapter: IPlatformAdapter, companyId: string) {
  const result = await adapter.invokeV5Api(`${getBrandedOffersPath()}/company/${companyId}`, {
    method: 'GET',
  });

  if (result.status !== 200) {
    throw new Error(
      result.status === 404 ? 'Company not found' : 'Unable to retrieve company details',
    );
  }

  const data = JSON.parse(result.data).data as LegacyCompany;

  return {
    id: data.id!,
    name: data.name,
    description: data.description
      ? {
          _type: 'richtext-module',
          content: [
            {
              _type: 'block',
              style: 'normal',
              markDefs: [],
              _key: 'df610d808744',
              children: [
                {
                  _type: 'span',
                  text: data.description,
                  marks: [],
                  _key: 'df610d8087440',
                },
              ],
            },
          ],
        }
      : null,
  } satisfies V2CompaniesGetCompanyResponse;
}
export async function legacy_GetOffersByCompany(adapter: IPlatformAdapter, companyId: string) {
  const result = await adapter.invokeV5Api(
    `${getBrandedOffersPath()}/company/${companyId}/offers`,
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

  const data = JSON.parse(result.data).data as LegacyCompanyOffers;

  return data.offers.map((offer) => {
    return {
      id: String(offer.id),
      name: offer.name,
      description: offer.description
        ? {
            _type: 'richtext-module',
            content: [
              {
                _type: 'block',
                style: 'normal',
                markDefs: [],
                _key: 'df610d808744',
                children: [
                  {
                    _type: 'span',
                    text: offer.description,
                    marks: [],
                    _key: 'df610d8087440',
                  },
                ],
              },
            ],
          }
        : null,
      type: offerTypeMap[offer.type],
      expires: offer.expiry as unknown as string,
      termsAndConditions: offer.terms
        ? {
            _type: 'richtext-module',
            content: [
              {
                _type: 'block',
                style: 'normal',
                markDefs: [],
                _key: 'df610d808744',
                children: [
                  {
                    _type: 'span',
                    text: offer.terms,
                    marks: [],
                    _key: 'df610d8087440',
                  },
                ],
              },
            ],
          }
        : null,
      image: offer.image,
      companyId: offer.companyId ? String(offer.companyId) : null,
    };
  }) satisfies V2CompaniesGetCompanyOffersResponse;
}
