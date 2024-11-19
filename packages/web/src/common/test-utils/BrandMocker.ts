import { BRANDS } from '@/types/brands.enum';

/**
 * To use this you need to require your target function after the mock is applied.
 * So for example
 * ```
 * mockBrand(BRANDS.BLC_UK);
 *
 * // Need to require the function inline here after the mock is applied
 * const { myFunction } = require('./MyFunction');
 * const result = myFunction();
 *
 * expect(result).toEqual('A request specific to the brand I have mocked for');
 * ```
 */
export function mockBrand(brand: BRANDS): void {
  jest.resetModules();
  jest.doMock('@/global-vars', () => ({
    ...jest.requireActual('@/global-vars'),
    BRAND: brand,
  }));
}
