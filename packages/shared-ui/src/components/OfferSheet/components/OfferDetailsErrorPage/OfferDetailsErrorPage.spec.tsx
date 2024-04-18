/* eslint-disable @typescript-eslint/no-explicit-any */
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
    render(<OfferDetailsErrorPage />);
  });

  it('should render component correctly', () => {
    const { getByRole, getByText } = render(<OfferDetailsErrorPage />);

    expect(getByRole('heading', { name: /error loading offer/i })).toBeTruthy();
    expect(getByText(/you can still get to your offer by clicking the button below\./i));
    expect(getByRole('button')).toBeTruthy();
  });
});
