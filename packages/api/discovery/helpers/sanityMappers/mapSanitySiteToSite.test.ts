import { Site as SanitySite } from '@bluelightcard/sanity-types';

import { mapSanitySiteToSite } from './mapSanitySiteToSite';

describe('mapSanitySiteToSite', () => {
  it('should map a valid SanitySite to a Site object correctly', () => {
    const sanitySite: SanitySite = {
      _id: 'siteId',
      _createdAt: '2021-08-02T14:00:00Z',
      _updatedAt: '2021-08-02T14:00:00Z',
      _rev: 'rev',
      _type: 'site',
      dealsOfTheWeekMenu: {
        _id: 'dealsOfTheWeekMenuId',
        _createdAt: '2021-08-02T14:00:00Z',
        _updatedAt: '2021-08-02T14:00:00Z',
        _rev: 'rev',
        _type: 'menu.offer',
      },
      featuredOffersMenu: {
        _id: 'featuredOffersMenuId',
        _createdAt: '2021-08-02T14:00:00Z',
        _rev: 'rev',
        _type: 'menu.offer',
        _updatedAt: '2021-08-02T14:00:00Z',
      },
      waysToSaveMenu: {
        _id: 'waysToSaveMenuId',
        _createdAt: '2021-08-02T14:00:00Z',
        _rev: 'rev',
        _type: 'menu.themed.offer',
        _updatedAt: '2021-08-02T14:00:00Z',
      },
    };

    const result = mapSanitySiteToSite(sanitySite);
    expect(result).toEqual({
      id: 'siteId',
      updatedAt: '2021-08-02T14:00:00Z',
      dealsOfTheWeekMenu: {
        id: 'dealsOfTheWeekMenuId',
      },
      featuredOffersMenu: {
        id: 'featuredOffersMenuId',
      },
      waysToSaveMenu: {
        id: 'waysToSaveMenuId',
      },
    });
  });
});
