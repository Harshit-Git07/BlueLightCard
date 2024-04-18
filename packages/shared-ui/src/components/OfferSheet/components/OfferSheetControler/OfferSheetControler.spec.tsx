/* eslint-disable @typescript-eslint/no-explicit-any */
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

describe('smoke test', () => {
  it('should render component without error', () => {
    render(<OfferSheetControler offerStatus="success" />);
  });

  it('should render correct screen for pending offer status', () => {
    const { container } = render(<OfferSheetControler offerStatus="pending" />);
    expect(container.querySelector('div > div > svg > path')).toBeTruthy();
  });

  it('should render correct screen for error offer status', () => {
    const { getByRole, getByText } = render(<OfferSheetControler offerStatus="error" />);

    expect(getByRole('heading', { name: /error loading offer/i })).toBeTruthy();
    expect(getByText(/you can still get to your offer by clicking the button below\./i));
    expect(getByRole('button')).toBeTruthy();
  });

  it('should render correct screen for success offer status', () => {
    const { getByRole } = render(<OfferSheetControler offerStatus="success" />);
    expect(getByRole('button', { name: /get discount/i })).toBeTruthy();
  });
});
