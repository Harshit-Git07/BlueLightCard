import { getCompany, getOffer, getOffersByCompany } from '../offers';
import { useMockPlatformAdapter } from 'src/adapters';
import { convertStringToRichtextModule } from 'src/utils/rich-text-utils';
import { createFactoryMethod } from 'src/utils/createFactoryMethod';

const createLegacyOffer = createFactoryMethod({
  id: 1,
  description: 'This is a test offer description.',
  name: 'Test Offer',
  type: 'Giftcards',
  expiry: new Date('2024-01-01'),
  terms: 'These are the terms and conditions.',
  image: 'path/to/image.jpg',
  companyId: 101,
  companyLogo: 'path/to/companyLogo.jpg',
});

const createModernOffer = createFactoryMethod({
  id: '100',
  description: convertStringToRichtextModule('Test description'),
  expires: '2024-01-01',
  name: 'Test Offer',
  termsAndConditions: convertStringToRichtextModule('Test terms and conditions'),
  type: 'gift-card',
  image: 'companyimages/complarge/retina/',
  companyId: '101',
});

const createLegacyOfferDescription = (description: string) => ({
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
          text: description,
          marks: [],
          _key: 'df610d8087440',
        },
      ],
    },
  ],
});

const createLegacyOfferTerms = (terms: string) => ({
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
          text: terms,
          marks: [],
          _key: 'df610d8087440',
        },
      ],
    },
  ],
});

describe('getOffer', () => {
  describe('when useCms is true', () => {
    const useCms = true;
    test('getOffer throws an error if the id is missing', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter(200);

      expect.assertions(1);
      try {
        await getOffer(mockPlatformAdapter, undefined, useCms);
      } catch (error) {
        expect(error).toEqual(new Error('Missing id'));
      }
    });

    test('getCompany throws an error if the id is missing', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter(200);

      expect.assertions(1);
      try {
        await getCompany(mockPlatformAdapter, undefined, useCms);
      } catch (error) {
        expect(error).toEqual(new Error('Missing id'));
      }
    });

    test('getOffersByCompany throws an error if the id is missing', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter(200);

      expect.assertions(1);
      try {
        await getOffersByCompany(mockPlatformAdapter, undefined, useCms);
      } catch (error) {
        expect(error).toEqual(new Error('Missing id'));
      }
    });

    test('getOffer calls the offer endpoint', async () => {
      const mockOffer = createModernOffer();
      const mockPlatformAdapter = useMockPlatformAdapter(200, mockOffer);

      const result = await getOffer(mockPlatformAdapter, mockOffer.id, useCms);

      expect(result).toEqual(mockOffer);
      expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(
        `/eu/offers/v2/v2/offers/${mockOffer.id.toString()}`,
        {
          method: 'GET',
        },
      );
    });

    test.each([
      [404, 'Offer not found'],
      [500, 'Unable to retrieve offer details'],
    ])('getOffer throws an error if the API request fails', async (statusCode, message) => {
      const mockPlatformAdapter = useMockPlatformAdapter(statusCode);

      expect.assertions(1);
      try {
        await getOffer(mockPlatformAdapter, '123', useCms);
      } catch (error) {
        expect(error).toEqual(new Error(message));
      }
    });

    test.each([
      [404, 'Company not found'],
      [500, 'Unable to retrieve company details'],
    ])('getCompany throws an error if the API request fails', async (statusCode, message) => {
      const mockPlatformAdapter = useMockPlatformAdapter(statusCode);

      expect.assertions(1);
      try {
        await getCompany(mockPlatformAdapter, '123', useCms);
      } catch (error) {
        expect(error).toEqual(new Error(message));
      }
    });

    test.each([[500, 'Unable to retrieve company offers']])(
      'getOffersByCompany throws an error if the API request fails',
      async (statusCode, message) => {
        const mockPlatformAdapter = useMockPlatformAdapter(statusCode);

        expect.assertions(1);
        try {
          await getOffersByCompany(mockPlatformAdapter, '123', useCms);
        } catch (error) {
          expect(error).toEqual(new Error(message));
        }
      },
    );

    test.each([[404, []]])(
      'getOffersByCompany returns an empty array if the API request fails by a 404',
      async (statusCode, response) => {
        const mockPlatformAdapter = useMockPlatformAdapter(statusCode);

        const result = await getOffersByCompany(mockPlatformAdapter, '123', useCms);
        expect(result).toEqual(response);
      },
    );
  });

  describe('when useCms is false', () => {
    const useCms = false;
    test('getOffer throws an error if the id is missing', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter(200);

      expect.assertions(1);
      try {
        await getOffer(mockPlatformAdapter, undefined, useCms);
      } catch (error) {
        expect(error).toEqual(new Error('Missing id'));
      }
    });

    test('getCompany throws an error if the id is missing', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter(200);

      expect.assertions(1);
      try {
        await getCompany(mockPlatformAdapter, undefined, useCms);
      } catch (error) {
        expect(error).toEqual(new Error('Missing id'));
      }
    });

    test('getOffersByCompany throws an error if the id is missing', async () => {
      const mockPlatformAdapter = useMockPlatformAdapter(200);

      expect.assertions(1);
      try {
        await getOffersByCompany(mockPlatformAdapter, undefined, useCms);
      } catch (error) {
        expect(error).toEqual(new Error('Missing id'));
      }
    });

    test.each([
      ['This is a test offer description.', 'These are the terms and conditions.'],
      [undefined, undefined],
    ])('getOffer calls the offer endpoint', async (description, terms) => {
      const mockOffer = createLegacyOffer({ description, terms });
      const mockPlatformAdapter = useMockPlatformAdapter(200, { data: mockOffer });

      const result = await getOffer(mockPlatformAdapter, mockOffer.id.toString(), useCms);

      expect(result).toEqual({
        id: mockOffer.id.toString(),
        name: mockOffer.name,
        description: !description ? null : createLegacyOfferDescription(mockOffer.description),
        type: 'gift-card',
        expires: mockOffer.expiry.toISOString(),
        termsAndConditions: !terms ? null : createLegacyOfferTerms(mockOffer.terms),
        image: mockOffer.image,
        companyId: mockOffer.companyId.toString(),
      });
      expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(
        `/eu/offers/offers/${mockOffer.id.toString()}`,
        {
          method: 'GET',
        },
      );
    });

    test.each([
      [404, 'Offer not found'],
      [500, 'Unable to retrieve offer details'],
    ])('getOffer throws an error if the API request fails', async (statusCode, message) => {
      const mockPlatformAdapter = useMockPlatformAdapter(statusCode);

      expect.assertions(1);
      try {
        await getOffer(mockPlatformAdapter, '123', useCms);
      } catch (error) {
        expect(error).toEqual(new Error(message));
      }
    });

    test.each([
      [404, 'Company not found'],
      [500, 'Unable to retrieve company details'],
    ])('getCompany throws an error if the API request fails', async (statusCode, message) => {
      const mockPlatformAdapter = useMockPlatformAdapter(statusCode);

      expect.assertions(1);
      try {
        await getCompany(mockPlatformAdapter, '123', useCms);
      } catch (error) {
        expect(error).toEqual(new Error(message));
      }
    });

    test.each([[500, 'Unable to retrieve company offers']])(
      'getOffersByCompany throws an error if the API request fails',
      async (statusCode, message) => {
        const mockPlatformAdapter = useMockPlatformAdapter(statusCode);

        expect.assertions(1);
        try {
          await getOffersByCompany(mockPlatformAdapter, '123', useCms);
        } catch (error) {
          expect(error).toEqual(new Error(message));
        }
      },
    );

    test.each([[404, []]])(
      'getOffersByCompany returns an empty array if the API request fails by a 404',
      async (statusCode, response) => {
        const mockPlatformAdapter = useMockPlatformAdapter(statusCode);

        const result = await getOffersByCompany(mockPlatformAdapter, '123', useCms);
        expect(result).toEqual(response);
      },
    );
  });
});
