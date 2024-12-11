import '@testing-library/jest-dom/extend-expect';
import { FC, PropsWithChildren } from 'react';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import {
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '../../../../shared-ui/src/adapters';
import Spinner from '@/modules/Spinner';
import MyCardPage from '@/pages/your-card';
import { formatDateDDMMYYYY } from '../../../../shared-ui/src/utils/dates';
import * as globals from '@/globals';
import { ApplicationSchema } from '@bluelightcard/shared-ui/components/CardVerificationAlerts/types';
import { defaultApplication } from '@bluelightcard/shared-ui/components/CardVerificationAlerts/testData';

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

const mockUseMemberCard = jest.fn();
jest.mock('../../../../shared-ui/src/components/RequestNewCard/useMemberCard', () => ({
  __esModule: true,
  default: () => mockUseMemberCard(),
}));

const mockUseMemberApplication = jest.fn();
jest.mock('../../../../shared-ui/src/components/RequestNewCard/useMemberApplication', () => ({
  __esModule: true,
  default: () => mockUseMemberApplication(),
}));

const awaitingIdProfile: ApplicationSchema = {
  ...defaultApplication,
  applicationReason: 'SIGNUP',
  eligibilityStatus: 'INELIGIBLE',
};

describe('MyCard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  test('displays generated card page', async () => {
    const firstName = 'firstname';
    const lastName = 'lastname';
    const cardNumber = 'BLC01234567';
    const expiryDate = '2024-12-12T00: 00: 00Z';

    mockUseMemberCard.mockReturnValue({
      firstName,
      lastName,
      card: {
        memberId: 'test',
        cardNumber,
        purchaseTime: '2024-12-12T00: 00: 00Z',
        expiryDate,
        cardStatus: 'PHYSICAL_CARD',
        paymentStatus: 'PAID_CARD',
      },
    });

    mockUseMemberApplication.mockReturnValue({ application: awaitingIdProfile });

    whenPageIsRendered();

    const name = await screen.findByText(`${firstName} ${lastName}`);
    expect(name).toBeInTheDocument();

    const accNo = await screen.findByText(cardNumber!);
    expect(accNo).toBeInTheDocument();

    const formattedDate = formatDateDDMMYYYY(new Date(expiryDate).toString());
    const date = screen.queryByText(formattedDate!);
    expect(date).toBeInTheDocument();

    // there is a copy button in the card itself and another one at the bottom of the page
    const copyBtn = (await screen.findAllByRole('button', { name: 'copy' }))[1];
    expect(copyBtn).toBeInTheDocument();

    const requestNewCardBtn = await screen.findByRole('button', { name: 'Request new card' });
    expect(requestNewCardBtn).toBeInTheDocument();
  });

  test('displays NOT generated card page', async () => {
    const firstName = 'firstname';
    const lastName = 'lastname';

    mockUseMemberCard.mockReturnValue({
      firstName,
      lastName,
      card: {},
    });

    mockUseMemberApplication.mockReturnValue({ application: awaitingIdProfile });

    whenPageIsRendered();

    const name = await screen.findByText(`${firstName} ${lastName}`);
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
    const firstName = 'firstname';
    const lastName = 'lastname';

    mockUseMemberCard.mockReturnValue({
      firstName,
      lastName,
      card: {},
    });

    mockUseMemberApplication.mockReturnValue({ application: null });

    whenPageIsRendered();

    const name = screen.queryByText(`${firstName} ${lastName}`);
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

    const firstName = 'firstname';
    const lastName = 'lastname';

    mockUseMemberCard.mockReturnValue({
      firstName,
      lastName,
      card: {},
    });

    mockUseMemberApplication.mockReturnValue({ application: null });

    describe(`when the brand is '${brand}'`, () => {
      it(`should display: ${message}`, () => {
        mockGlobals.BRAND = brand;

        whenPageIsRendered();

        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });
  });
});
