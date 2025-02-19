import { MenuThemedOffer as SanityThemedMenuOffer, MenuWaysToSave } from '@bluelightcard/sanity-types';

import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';

import { validSanityMenuOffer } from './mapSanityMenuOfferToMenuOffer.test';
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
      reference: validSanityMenuOffer.offer,
      overrides: {
        description: 'Override description',
        image: {
          default: {
            asset: {
              url: 'http://test.com',
              _id: '',
              _type: 'sanity.imageAsset',
              _createdAt: '',
              _updatedAt: '',
              _rev: '',
            },
            _type: 'image',
          },
        },
        title: 'Override title',
      },
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

const validSanityWaysToSaveMenu = {
  _createdAt: '2021-09-01T00:00:00Z',
  _id: '123',
  _rev: '123',
  _type: 'menu.waysToSave',
  _updatedAt: '2021-09-01T00:00:00Z',
  title: 'title',
  end: '2021-09-01T00:00:00Z',
  start: '2021-09-01T00:00:00Z',
  inclusions: [validInclusion],
};
describe('mapSanityThemedMenuToThemedMenu', () => {
  const testCases = [
    {
      input: validSanityThemedMenu,
      menuType: MenuType.FLEXIBLE_OFFERS,
    },
    {
      input: validSanityWaysToSaveMenu,
      menuType: MenuType.WAYS_TO_SAVE,
    },
  ];
  it.each(testCases)('should map sanity themed menu to themed menu', ({ input, menuType }) => {
    const result = mapSanityThemedMenuToThemedMenu(input as SanityThemedMenuOffer | MenuWaysToSave);
    const expected = (menuType: MenuType) => ({
      endTime: '2021-09-01T00:00:00Z',
      id: '123',
      menuType: menuType,
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
              position: 0,
              overrides: {
                description: 'Override description',
                image: 'http://test.com',
                title: 'Override title',
              },
            },
          ],
          title: 'collection name',
          position: 0,
        },
      ],
      updatedAt: '2021-09-01T00:00:00Z',
    });
    expect(result).toEqual(expected(menuType));
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
                reference: { ...validSanityMenuOffer, company: undefined },
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
