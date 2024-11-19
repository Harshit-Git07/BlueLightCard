import { mockBrand } from '@/root/src/common/test-utils/BrandMocker';
import { BRANDS } from '@/types/brands.enum';

interface TestCase {
  brand: BRANDS;
  expected: string;
}

const testCases: TestCase[] = [
  {
    brand: BRANDS.BLC_UK,
    expected: 'https://play.google.com/store/apps/details?id=com.bluelightcard.user&amp;hl=en_GB',
  },
  {
    brand: BRANDS.BLC_AU,
    expected: 'https://play.google.com/store/apps/details?id=com.au.bluelightcard.user',
  },
  {
    brand: BRANDS.DDS_UK,
    expected: 'https://play.google.com/store/search?q=defence+discount+service&c=apps',
  },
];

testCases.forEach(({ brand, expected }) => {
  it(`should return url '${expected}' for brand '${brand}'`, () => {
    mockBrand(brand);

    const { googleStoreUrl } = require('./GoogleStoreUrl');

    expect(googleStoreUrl).toBe(expected);
  });
});
