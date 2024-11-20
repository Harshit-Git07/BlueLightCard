import { MenuThemedOffer as SanityThemedMenuOffer } from '@bluelightcard/sanity-types';

import { validSanityOffer } from './mapSanityMenuOfferToMenuOffer.test';
import { mapSanityThemedMenuToThemedMenu } from './mapSanityThemedMenuToThemedMenu';

const validInclusion = {
  _key: 'inclusion-key',
  _type: 'collection',
  collectionDescription: 'collection description',
  collectionName: 'collection name',
  contents: [
    {
      _key: 'content-key',
      _type: 'companyOfferReference',
    },
    {
      _key: 'content-key',
      _type: 'offerReference',
      reference: validSanityOffer,
    },
  ],
};

const validSanityThemedMenu = {
  _createdAt: '2021-09-01T00:00:00Z',
  _id: '123',
  _rev: '123',
  _type: 'menu.themed.offer',
  _updatedAt: '2021-09-01T00:00:00Z',
  title: 'title',
  end: '2021-09-01T00:00:00Z',
  start: '2021-09-01T00:00:00Z',
  inclusions: [validInclusion],
};
describe('mapSanityThemedMenuToThemedMenu', () => {
  it('should map sanity themed menu to themed menu', () => {
    const result = mapSanityThemedMenuToThemedMenu(validSanityThemedMenu as SanityThemedMenuOffer);
    expect(result).toEqual({
      endTime: '2021-09-01T00:00:00Z',
      id: '123',
      menuType: 'flexible',
      name: 'title',
      startTime: '2021-09-01T00:00:00Z',
      themedMenusOffers: [
        {
          description: 'collection description',
          id: 'inclusion-key',
          imageURL: '',
          offers: [
            {
              company: {
                id: 'company1',
              },
              id: '1',
            },
          ],
          title: 'collection name',
        },
      ],
      updatedAt: '2021-09-01T00:00:00Z',
    });
  });

  const errorCases = [
    {
      field: 'title',
      menuThemedOffer: {
        ...validSanityThemedMenu,
        title: undefined,
      },
    },
    {
      field: 'collectionName',
      menuThemedOffer: {
        ...validSanityThemedMenu,
        inclusions: [
          {
            ...validInclusion,
            collectionName: undefined,
          },
        ],
      },
    },
    {
      field: 'collectionDescription',
      menuThemedOffer: {
        ...validSanityThemedMenu,
        inclusions: [
          {
            ...validInclusion,
            collectionDescription: undefined,
          },
        ],
      },
    },
    {
      field: 'collectionName',
      menuThemedOffer: {
        ...validSanityThemedMenu,
        inclusions: [
          {
            ...validInclusion,
            collectionName: undefined,
          },
        ],
      },
    },
    {
      field: 'reference',
      menuThemedOffer: {
        ...validSanityThemedMenu,
        inclusions: [
          {
            ...validInclusion,
            contents: [
              {
                _key: 'content-key',
                _type: 'offerReference',
                reference: undefined,
              },
            ],
          },
        ],
      },
    },
    {
      field: 'company',
      menuThemedOffer: {
        ...validSanityThemedMenu,
        inclusions: [
          {
            ...validInclusion,
            contents: [
              {
                _key: 'content-key',
                _type: 'offerReference',
                reference: { ...validSanityOffer, company: undefined },
              },
            ],
          },
        ],
      },
    },
  ];

  it.each(errorCases)('should throw error when %s is missing', ({ field, menuThemedOffer }) => {
    expect(() => mapSanityThemedMenuToThemedMenu(menuThemedOffer as SanityThemedMenuOffer)).toThrow(
      `Missing sanity field: ${field}`,
    );
  });
});
