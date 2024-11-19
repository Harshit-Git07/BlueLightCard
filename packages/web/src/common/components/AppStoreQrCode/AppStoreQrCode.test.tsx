import '@testing-library/jest-dom';
import { mockBrand } from '@/root/src/common/test-utils/BrandMocker';
import { BRANDS } from '@/types/brands.enum';
import { screen, render } from '@testing-library/react';

interface TestCase {
  brand: BRANDS;
  expected: string;
}

const testCases: TestCase[] = [
  {
    brand: BRANDS.BLC_UK,
    expected: 'blc-uk-qr-code',
  },
  {
    brand: BRANDS.BLC_AU,
    expected: 'blc-au-qr-code',
  },
  {
    brand: BRANDS.DDS_UK,
    expected: 'dds-uk-qr-code',
  },
];

testCases.forEach(({ brand, expected }) => {
  it(`should return svg with test id '${expected}' for brand '${brand}'`, () => {
    mockBrand(brand);

    const { AppStoreQrCode } = require('./AppStoreQrCode');
    render(<AppStoreQrCode />);

    expect(screen.queryByTestId(expected)).toBeInTheDocument();
  });
});
