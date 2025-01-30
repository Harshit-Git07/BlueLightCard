describe('V5 API URLs', () => {
  describe('blc-au', () => {
    const originalEnv = process.env;

    beforeAll(() => {
      process.env = { ...originalEnv, NEXT_PUBLIC_APP_BRAND: 'blc-au' };
    });

    afterAll(() => {
      process.env = originalEnv;
      jest.resetModules();
    });

    it('Returns BLC AU Discovery endpoints', () => {
      const { V5_API_URL } = require('./apiUrl');

      expect(V5_API_URL).toMatchObject({
        Categories: '/au/discovery/categories',
        Companies: '/au/discovery/companies',
        Search: '/au/discovery/search',
        FlexibleOffers: '/au/discovery/menus/flexible',
        Menus: '/au/discovery/menus',
      });
    });
  });

  describe('blc-uk', () => {
    const originalEnv = process.env;

    beforeAll(() => {
      process.env = { ...originalEnv, NEXT_PUBLIC_APP_BRAND: 'blc-uk' };
    });

    afterAll(() => {
      process.env = originalEnv;
      jest.resetModules();
    });

    it('Returns BLC UK Discovery endpoints', () => {
      const { V5_API_URL } = require('./apiUrl');

      expect(V5_API_URL).toMatchObject({
        Categories: '/eu/discovery/categories',
        Companies: '/eu/discovery/companies',
        Search: '/eu/discovery/search',
        FlexibleOffers: '/eu/discovery/menus/flexible',
        Menus: '/eu/discovery/menus',
      });
    });
  });

  describe('dds-uk', () => {
    const originalEnv = process.env;

    beforeAll(() => {
      process.env = { ...originalEnv, NEXT_PUBLIC_APP_BRAND: 'dds-uk' };
    });

    afterAll(() => {
      process.env = originalEnv;
      jest.resetModules();
    });

    it('Returns DDS UK Discovery endpoints', () => {
      const { V5_API_URL } = require('./apiUrl');

      expect(V5_API_URL).toMatchObject({
        Categories: '/eu/discovery/dds/categories',
        Companies: '/eu/discovery/dds/companies',
        Search: '/eu/discovery/dds/search',
        FlexibleOffers: '/eu/discovery/dds/menus/flexible',
        Menus: '/eu/discovery/dds/menus',
      });
    });
  });
});
