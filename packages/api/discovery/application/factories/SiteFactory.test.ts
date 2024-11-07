import { siteFactory } from './SiteFactory';

describe('Site Factory', () => {
  it('should build a default Site object', () => {
    const site = siteFactory.build();
    expect(site).toEqual({
      id: '1',
      dealsOfTheWeekMenu: { id: 'deals-of-the-week-id-1' },
      featuredOffersMenu: { id: 'featured-offers-id-1' },
      updatedAt: '2022-09-01T00:00:00',
    });
  });

  it('should build an Site object with overridden id', () => {
    const site = siteFactory.build({ id: 'custom_id' });
    expect(site.id).toBe('custom_id');
  });
});
