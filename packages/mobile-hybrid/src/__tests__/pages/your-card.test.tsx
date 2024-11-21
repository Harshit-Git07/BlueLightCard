import '@testing-library/jest-dom/extend-expect';
import { FC, PropsWithChildren } from 'react';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import {
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '../../../../shared-ui/src/adapters';
import Spinner from '@/modules/Spinner';
import MyCardPage from '@/pages/your-card';
import {
  customerProfileCardGeneratedMock,
  customerProfileCardNotGeneratedMock,
  customerProfileNoCardMock,
} from '../../../../shared-ui/src/mocks';
import { formatDateDDMMYYYY } from '../../../../shared-ui/src/utils/dates';
import * as globals from '@/globals';

const mockGlobals = globals as { BRAND: string };
jest.mock('@/globals', () => ({
  ...jest.requireActual('@/globals'),
  __esModule: true,
  BRAND: 'blc-uk',
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('@tanstack/react-query', () => {
  const actualReactQuery = jest.requireActual('@tanstack/react-query');
  return {
    ...actualReactQuery,
    useQuery: jest.fn(),
  };
});

describe('MyCard Page', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();

  const WithSpinner: FC<PropsWithChildren> = ({ children }) => {
    return (
      <div>
        {children}
        <Spinner />
      </div>
    );
  };

  const whenPageIsRendered = async (platformAdapter = mockPlatformAdapter) => {
    const queryClient = new QueryClient();

    return render(
      <QueryClientProvider client={queryClient}>
        <PlatformAdapterProvider adapter={platformAdapter}>
          <RouterContext.Provider value={mockRouter as NextRouter}>
            <JotaiTestProvider initialValues={[]}>
              <WithSpinner>
                <MyCardPage />
              </WithSpinner>
            </JotaiTestProvider>
          </RouterContext.Provider>
        </PlatformAdapterProvider>
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays generated card page', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isSuccess: true,
      data: customerProfileCardGeneratedMock,
    });

    whenPageIsRendered();

    const name = await screen.findByText(
      `${customerProfileCardGeneratedMock.firstName} ${customerProfileCardGeneratedMock.lastName}`,
    );
    expect(name).toBeInTheDocument();

    const accNo = await screen.findByText(customerProfileCardGeneratedMock.card!.cardNumber!);
    expect(accNo).toBeInTheDocument();

    const formattedDate = formatDateDDMMYYYY(
      new Date(customerProfileCardGeneratedMock.card!.cardExpiry!).toString(),
    );
    const date = screen.queryByText(formattedDate!);
    expect(date).toBeInTheDocument();

    // there is a copy button in the card itself and another one at the bottom of the page
    const copyBtn = (await screen.findAllByRole('button', { name: 'copy' }))[1];
    expect(copyBtn).toBeInTheDocument();

    const requestNewCardBtn = await screen.findByRole('button', { name: 'Request new card' });
    expect(requestNewCardBtn).toBeInTheDocument();
  });

  test('displays NOT generated card page', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isSuccess: true,
      data: customerProfileCardNotGeneratedMock,
    });

    whenPageIsRendered();

    const name = await screen.findByText(
      `${customerProfileCardNotGeneratedMock.firstName} ${customerProfileCardNotGeneratedMock.lastName}`,
    );
    expect(name).toBeInTheDocument();

    const defaultAccNo = screen.getByText('BLC0000000');
    expect(defaultAccNo).toBeInTheDocument();

    const expDate = screen.queryByText('12/12/2024');
    expect(expDate).not.toBeInTheDocument();

    const defaultExpDate = screen.getByText('01/01/2030');
    expect(defaultExpDate).toBeInTheDocument();

    const copyBtn = screen.queryByRole('button', { name: 'copy' });
    expect(copyBtn).not.toBeInTheDocument();

    const requestNewCardBtn = screen.queryByRole('button', { name: 'Request new card' });
    expect(requestNewCardBtn).not.toBeInTheDocument();
  });

  test('displays No card present page', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isSuccess: true,
      data: customerProfileNoCardMock,
    });

    whenPageIsRendered();

    const name = screen.queryByText(
      `${customerProfileNoCardMock.firstName} ${customerProfileNoCardMock.lastName}`,
    );
    expect(name).not.toBeInTheDocument();

    const copyBtn = screen.queryByRole('button', { name: 'copy' });
    expect(copyBtn).not.toBeInTheDocument();

    const requestNewCardBtn = screen.queryByRole('button', { name: 'Request new card' });
    expect(requestNewCardBtn).not.toBeInTheDocument();

    expect(screen.getByText("You don't have a card yet")).toBeInTheDocument();

    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
    expect(btn.textContent).toEqual('Get your card');
  });

  describe.each([
    [
      'blc-au',
      'Access every exclusive offer for the next 2 years. Get your Blue light Card for $4.99.',
    ],
    [
      'blc-uk',
      'Access every exclusive offer for the next 2 years. Get your Blue light Card for £4.99.',
    ],
    [
      'dds-uk',
      'Access every exclusive offer for the next 5 years. Get your Defence Discount Service card for £4.99.',
    ],
  ])('`No card present message', (brand, message) => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    (useQuery as jest.Mock).mockReturnValue({
      isSuccess: true,
      data: customerProfileNoCardMock,
    });

    describe(`when the brand is '${brand}'`, () => {
      it(`should display: ${message}`, () => {
        mockGlobals.BRAND = brand;

        whenPageIsRendered();

        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });
  });
});
