import { mockBrand } from '@/root/src/common/test-utils/BrandMocker';
import { BRANDS } from '@/types/brands.enum';

interface TestCase {
  brand: BRANDS;
  expected: string;
}

const testCases: TestCase[] = [
  {
    brand: BRANDS.BLC_UK,
    expected: 'https://itunes.apple.com/gb/app/blue-light-card/id689970073?mt=8',
  },
  {
    brand: BRANDS.BLC_AU,
    expected: 'https://apps.apple.com/au/app/blue-light-card/id1637398997',
  },
  {
    brand: BRANDS.DDS_UK,
    expected: 'https://apps.apple.com/gb/app/defence-discount-service/id652448774',
  },
];

testCases.forEach(({ brand, expected }) => {
  it(`should return url '${expected}' for brand '${brand}'`, () => {
    mockBrand(brand);

    const { appleStoreUrl } = require('./AppleStoreUrl');

    expect(appleStoreUrl).toBe(expected);
  });
});
