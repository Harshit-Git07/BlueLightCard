import { MenuThemedOffer as SanityThemedMenuOffer } from '@bluelightcard/sanity-types';

import { getSiteConfig } from '@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/SiteEventHandler';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';

import { validSanityMenuOffer } from './mapSanityMenuOfferToMenuOffer.test';
import { mapSanityThemedMenuToThemedMenu } from './mapSanityThemedMenuToThemedMenu';

jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/SiteEventHandler');

const getSiteConfigMock = jest.mocked(getSiteConfig);

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
describe('mapSanityThemedMenuToThemedMenu', () => {
  it('should map sanity themed menu to themed menu', async () => {
    getSiteConfigMock.mockResolvedValue(undefined);
    const result = await mapSanityThemedMenuToThemedMenu(validSanityThemedMenu as SanityThemedMenuOffer);
    expect(result).toEqual({
      endTime: '2021-09-01T00:00:00Z',
      id: '123',
      menuType: MenuType.FLEXIBLE_OFFERS,
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
  });

  it('should map to the correct sanity Themed Menu Type if ways to save is in site config', async () => {
    getSiteConfigMock.mockResolvedValue({
      waysToSaveMenu: {
        id: validSanityThemedMenu._id,
      },
      dealsOfTheWeekMenu: {},
      featuredOffersMenu: {},
      id: '123',
      updatedAt: '2021-09-01T00:00:00Z',
    });
    const result = await mapSanityThemedMenuToThemedMenu(validSanityThemedMenu as SanityThemedMenuOffer);
    expect(result.menuType).toBe(MenuType.WAYS_TO_SAVE);
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

  it.each(errorCases)('should throw error when %s is missing', async ({ field, menuThemedOffer }) => {
    await expect(mapSanityThemedMenuToThemedMenu(menuThemedOffer as SanityThemedMenuOffer)).rejects.toThrow(
      `Missing sanity field: ${field}`,
    );
  });
});
