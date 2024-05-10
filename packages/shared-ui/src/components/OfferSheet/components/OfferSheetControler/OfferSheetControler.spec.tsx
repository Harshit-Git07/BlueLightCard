/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlatformAdapterProvider, useMockPlatformAdapter } from 'src/adapters';
import OfferSheetControler from '.';
import { render } from '@testing-library/react';

jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
    push: jest.fn(),
  }),
}));

const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType: 'vault' } });

describe('smoke test', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render component without error', () => {
    render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <OfferSheetControler offerStatus="success" />
      </PlatformAdapterProvider>,
    );
  });

  it('should render correct screen for pending offer status', () => {
    const { container } = render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <OfferSheetControler offerStatus="pending" />
      </PlatformAdapterProvider>,
    );
    expect(container.querySelector('div > div > svg > path')).toBeTruthy();
  });

  it('should render correct screen for error offer status', () => {
    const { getByRole, getByText } = render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <OfferSheetControler offerStatus="error" />
      </PlatformAdapterProvider>,
    );

    expect(getByRole('heading', { name: /error loading offer/i })).toBeTruthy();
    expect(getByText(/you can still get to your offer by clicking the button below\./i));
    expect(getByRole('button')).toBeTruthy();
  });

  it('should render correct screen for success offer status', () => {
    const { getByRole } = render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <OfferSheetControler offerStatus="success" />
      </PlatformAdapterProvider>,
    );
    expect(getByRole('button', { name: /get discount/i })).toBeTruthy();
  });
});
