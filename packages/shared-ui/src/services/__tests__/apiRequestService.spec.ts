import {
  apiRequest,
  CMS_SERVICES,
  CMSCompanyOffersSchema,
  CMSOfferDataSchema,
} from '../apiRequestService';
import { useMockPlatformAdapter } from 'src/adapters';
import { CompanyDataSchema, OfferDataSchema, CompanyOffersSchema } from '../apiRequestService';

const v5ApiTestTable = [
  {
    service: CMS_SERVICES.COMPANY_DATA,
    mockData: {
      id: 101,
      name: 'Test Company',
      description: 'A test company',
    },
    mockPath: `/eu/offers/company/101`,
    expected: CompanyDataSchema.parse({
      id: 101,
      name: 'Test Company',
      description: 'A test company',
    }),
  },
  {
    service: CMS_SERVICES.OFFER_DETAILS_DATA,
    mockData: {
      id: 100,
      companyId: 101,
      companyLogo: 'test-company-logo.png',
      description: 'A test offer',
      expiry: '2024-01-01',
      name: 'Test Offer',
      terms: 'Some terms and conditions',
      type: 'a-type',
      image: 'test-image.png',
    },
    mockPath: `/eu/offers/offers/100`,
    expected: OfferDataSchema.parse({
      id: 100,
      companyId: 101,
      companyLogo: 'test-company-logo.png',
      description: 'A test offer',
      expiry: '2024-01-01',
      name: 'Test Offer',
      terms: 'Some terms and conditions',
      type: 'a-type',
      image: 'test-image.png',
    }),
  },
  {
    service: CMS_SERVICES.OFFERS_BY_COMPANY_DATA,
    mockData: {
      offers: [
        {
          id: 100,
          description: 'A test offer',
          expiry: '2024-01-01',
          name: 'Test Offer',
          terms: 'Some terms and conditions',
          type: 'a-type',
          image: 'test-image.png',
        },
      ],
    },
    mockPath: `/eu/offers/company/101/offers`,
    expected: CompanyOffersSchema.parse([
      {
        id: 100,
        description: 'A test offer',
        expiry: '2024-01-01',
        name: 'Test Offer',
        terms: 'Some terms and conditions',
        type: 'a-type',
        image: 'test-image.png',
      },
    ]),
  },
];

const cmsApiTestTable = [
  {
    service: CMS_SERVICES.COMPANY_DATA,
    mockData: {
      id: '101',
      name: 'Test Company',
      description: 'A test company',
    },
    mockPath: `/eu/offers/v2/v2/companies/101`,
    expected: CompanyDataSchema.parse({
      id: '101',
      name: 'Test Company',
      description: 'A test company', // TODO: make it a portableText object
    }),
    error: `Error fetching ${CMS_SERVICES.COMPANY_DATA} API details`,
  },
  {
    service: CMS_SERVICES.OFFER_DETAILS_DATA,
    mockData: {
      id: '100',
      description: 'A test offer', // TODO: make it a portableText object
      expires: '2024-01-01',
      name: 'Test Offer',
      termsAndConditions: 'Some terms and conditions', // TODO: make it a portableText object
      type: 'a-type',
      image: 'test-image.png',
    },
    mockPath: `/eu/offers/v2/v2/offers/100`,
    expected: CMSOfferDataSchema.parse({
      id: '100',
      description: 'A test offer', // TODO: make it a portableText object
      expires: '2024-01-01',
      name: 'Test Offer',
      termsAndConditions: 'Some terms and conditions', // TODO: make it a portableText object
      type: 'a-type',
      image: 'test-image.png',
    }),
    error: `Error fetching ${CMS_SERVICES.OFFER_DETAILS_DATA} API details`,
  },
  {
    service: CMS_SERVICES.OFFERS_BY_COMPANY_DATA,
    mockData: [
      {
        id: '100',
        description: 'A test offer', // TODO: make it a portableText object
        expires: '2024-01-01',
        name: 'Test Offer',
        termsAndConditions: 'Some terms and conditions', // TODO: make it a portableText object
        type: 'a-type',
        image: 'test-image.png',
      },
    ],
    mockPath: `/eu/offers/v2/v2/companies/101/offers`,
    expected: CMSCompanyOffersSchema.parse([
      {
        id: '100',
        description: 'A test offer', // TODO: make it a portableText object
        expires: '2024-01-01',
        name: 'Test Offer',
        termsAndConditions: 'Some terms and conditions', // TODO: make it a portableText object
        type: 'a-type',
        image: 'test-image.png',
      },
    ]),
    error: `Error fetching ${CMS_SERVICES.OFFERS_BY_COMPANY_DATA} API details`,
  },
];

describe('apiRequestService', () => {
  test.each(v5ApiTestTable)(
    'fetches V5 API $service service successfully with isCmsFlagOn: false',
    async ({ service, mockData, mockPath, expected }) => {
      const mockPlatformAdapter = useMockPlatformAdapter(200, { data: mockData });
      const result = await apiRequest({
        service,
        adapter: mockPlatformAdapter,
        isCmsFlagOn: false,
        companyId: 101,
        offerId: 100,
      });

      expect(result).toEqual(expected);
      expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(mockPath, { method: 'GET' });
    },
  );

  test.each(cmsApiTestTable)(
    'fetches CMS API $service service successfully with isCmsFlagOn: true',
    async ({ service, mockData, mockPath, expected }) => {
      const mockPlatformAdapter = useMockPlatformAdapter(200, mockData);
      const result = await apiRequest({
        service,
        adapter: mockPlatformAdapter,
        isCmsFlagOn: true,
        companyId: 101,
        offerId: 100,
      });

      expect(result).toEqual(expected);
      expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(mockPath, { method: 'GET' });
    },
  );
});
