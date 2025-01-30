describe('Constants', () => {
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
        const { V5_API_URL } = require('./constants');

        expect(V5_API_URL).toMatchObject({
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
        const { V5_API_URL } = require('./constants');

        expect(V5_API_URL).toMatchObject({
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
        const { V5_API_URL } = require('./constants');

        expect(V5_API_URL).toMatchObject({
          Menus: '/eu/discovery/dds/menus',
        });
      });
    });
  });
});
