/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlatformAdapterProvider, useMockPlatformAdapter } from 'src/adapters';
import OfferDetailsErrorPage from '.';
import { fireEvent, render } from '@testing-library/react';
import { useHydrateAtoms } from 'jotai/utils';
import { Provider } from 'jotai';
import { offerSheetAtom } from '../../store';

const mockCompanyId = 4242;

jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
    push: jest.fn(),
  }),
}));

const HydrateAtoms = ({
  initialValues,
  children,
}: {
  initialValues: any;
  children: React.ReactNode;
}) => {
  useHydrateAtoms(initialValues);
  return children;
};

const TestProvider = ({
  initialValues,
  children,
}: {
  initialValues: any;
  children: React.ReactNode;
}) => (
  <Provider>
    <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
  </Provider>
);

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

    expect(
      getByRole('heading', { name: /sorry, we couldn’t load your offer at the moment\./i }),
    ).toBeTruthy();
    expect(getByText(/don’t worry, you can access it by clicking the button below\./i));
    expect(getByRole('button')).toBeTruthy();
  });

  it('should navigate to the company page when clicking the company CTA', () => {
    const mockPlatformAdapter = useMockPlatformAdapter();
    const { getByRole } = render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <TestProvider
          initialValues={[[offerSheetAtom, { offerMeta: { companyId: mockCompanyId } }]]}
        >
          <OfferDetailsErrorPage />
        </TestProvider>
      </PlatformAdapterProvider>,
    );
    fireEvent.click(getByRole('button'));

    expect(mockPlatformAdapter.navigate).toHaveBeenCalledTimes(1);
    expect(mockPlatformAdapter.navigate).toHaveBeenCalledWith(
      `/offerdetails.php?cid=${mockCompanyId}`,
    );
  });
});
