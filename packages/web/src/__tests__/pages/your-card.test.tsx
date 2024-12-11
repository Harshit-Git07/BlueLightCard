import '@testing-library/jest-dom/extend-expect';
import { NextRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMedia } from 'react-use';
import { render, screen, within } from '@testing-library/react';
import { Factory } from 'fishery';
import _noop from 'lodash/noop';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import UserContext, { UserContextType } from '@/context/User/UserContext';
import {
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '../../../../shared-ui/src/adapters';
import MyCardPage from '@/pages/your-card';
import { formatDateDDMMYYYY } from '../../../../shared-ui/src/utils/dates';
import { ApplicationSchema } from '@bluelightcard/shared-ui/components/CardVerificationAlerts/types';
import { defaultApplication } from '@bluelightcard/shared-ui/components/CardVerificationAlerts/testData';
import * as globals from '@/global-vars';

const mockGlobals = globals as { BRAND: string };
jest.mock('@/global-vars', () => ({
  ...jest.requireActual('@/global-vars'),
  __esModule: true,
  BRAND: 'blc-uk',
}));

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  isReady: true,
};

const userContextTypeFactory = Factory.define<UserContextType>(() => ({
  dislikes: [],
  error: undefined,
  isAgeGated: false,
  setUser: _noop,
  user: {
    companies_follows: [],
    legacyId: 'mock-legacy-id',
    profile: {
      dob: 'mock-dob',
      organisation: 'mock-organisation',
    },
    uuid: 'mock-uuid',
  },
}));

const userContext = userContextTypeFactory.build();

jest.mock('react-use', () => ({
  useMedia: jest.fn(),
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
  const mockPlatformAdapter = useMockPlatformAdapter();

  const whenPageIsRendered = (platformAdapter = mockPlatformAdapter) => {
    return render(
      <QueryClientProvider client={new QueryClient()}>
        <PlatformAdapterProvider adapter={platformAdapter}>
          <UserContext.Provider value={userContext}>
            <RouterContext.Provider value={mockRouter as NextRouter}>
              <UserContext.Provider value={userContext}>
                <MyCardPage />
              </UserContext.Provider>
            </RouterContext.Provider>
          </UserContext.Provider>
        </PlatformAdapterProvider>
      </QueryClientProvider>
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

    (useMedia as jest.Mock).mockReturnValue(false);

    whenPageIsRendered();

    const pageTitle = screen.getByText('Your card');
    expect(pageTitle).toBeInTheDocument();

    const requestNewCardBtn = within(pageTitle!.parentElement!).getByRole('button', {
      name: 'Request new card',
    });
    expect(requestNewCardBtn).toBeInTheDocument();

    const name = await screen.findByText(`${firstName} ${lastName}`);
    expect(name).toBeInTheDocument();

    const accNo = await screen.findByText(cardNumber);
    expect(accNo).toBeInTheDocument();

    const formattedDate = formatDateDDMMYYYY(new Date(expiryDate).toString());
    const date = screen.queryByText(formattedDate!);
    expect(date).toBeInTheDocument();

    jest.clearAllMocks();
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

    (useMedia as jest.Mock).mockReturnValue(false);

    whenPageIsRendered();

    const pageTitle = screen.getByText('Your card');
    expect(pageTitle).toBeInTheDocument();

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

    jest.clearAllMocks();
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

    (useMedia as jest.Mock).mockReturnValue(false);

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

    jest.clearAllMocks();
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
    afterAll(() => {
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
