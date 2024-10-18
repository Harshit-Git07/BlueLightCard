import { MenuOffer } from '@bluelightcard/sanity-types';

import { HomepageMenu } from '@blc-mono/discovery/application/models/HomepageMenu';

import { mapSanityMenuOfferToHomepageMenu } from './mapSanityMenuOfferToHomepageMenu';

describe('mapSanityMenuOfferToHomepageMenu', () => {
  it('should map all fields correctly', () => {
    const sanityMenuOffer: MenuOffer = {
      _id: 'menu1',
      _type: 'menu.offer',
      _rev: 'rev1',
      _updatedAt: '2023-01-02T00:00:00Z',
      _createdAt: '2023-01-02T00:00:00Z',
      title: 'Menu Title',
      start: '2023-01-01T00:00:00Z',
      end: '2023-12-31T23:59:59Z',
    };

    const expectedHomepageMenu: HomepageMenu = {
      id: 'menu1',
      name: 'Menu Title',
      startTime: '2023-01-01T00:00:00Z',
      endTime: '2023-12-31T23:59:59Z',
      updatedAt: '2023-01-02T00:00:00Z',
    };

    const result = mapSanityMenuOfferToHomepageMenu(sanityMenuOffer);

    expect(result).toEqual(expectedHomepageMenu);
  });

  it('should handle missing optional fields', () => {
    const sanityMenuOffer: MenuOffer = {
      _id: 'menu2',
      _type: 'menu.offer',
      _rev: 'rev2',
      _updatedAt: '2023-01-02T00:00:00Z',
      _createdAt: '2023-01-02T00:00:00Z',
    };

    const expectedHomepageMenu: HomepageMenu = {
      id: 'menu2',
      name: '',
      startTime: '',
      endTime: '',
      updatedAt: '2023-01-02T00:00:00Z',
    };

    const result = mapSanityMenuOfferToHomepageMenu(sanityMenuOffer);

    expect(result).toEqual(expectedHomepageMenu);
  });
});
