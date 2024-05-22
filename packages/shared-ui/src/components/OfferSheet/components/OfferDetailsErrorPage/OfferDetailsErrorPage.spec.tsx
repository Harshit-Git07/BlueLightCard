/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlatformAdapterProvider, useMockPlatformAdapter } from 'src/adapters';
import OfferDetailsErrorPage from '.';
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

describe('smoke test', () => {
  it('should render component without error', () => {
    const mockPlatformAdapter = useMockPlatformAdapter();
    render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <OfferDetailsErrorPage />
      </PlatformAdapterProvider>,
    );
  });

  it('should render component correctly', () => {
    const mockPlatformAdapter = useMockPlatformAdapter();
    const { getByRole, getByText } = render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <OfferDetailsErrorPage />
      </PlatformAdapterProvider>,
    );

    expect(getByRole('heading', { name: /error loading offer/i })).toBeTruthy();
    expect(getByText(/you can still get to your offer by clicking the button below\./i));
    expect(getByRole('button')).toBeTruthy();
  });
});
