import '@testing-library/jest-dom/extend-expect';
import { NextRouter } from 'next/router';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
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
import {
  customerProfileCardGeneratedMock,
  customerProfileCardNotGeneratedMock,
  customerProfileNoCardMock,
} from '../../../../shared-ui/src/mocks';
import { formatDateDDMMYYYY } from '../../../../shared-ui/src/utils/dates';

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

jest.mock('@tanstack/react-query', () => {
  const actualReactQuery = jest.requireActual('@tanstack/react-query');
  return {
    ...actualReactQuery,
    useQuery: jest.fn(),
  };
});

jest.mock('react-use', () => ({
  useMedia: jest.fn(),
}));

describe('MyCard Page', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();

  const whenPageIsRendered = async (platformAdapter = mockPlatformAdapter) => {
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
    (useQuery as jest.Mock).mockReturnValue({
      isSuccess: true,
      data: customerProfileCardGeneratedMock,
    });

    (useMedia as jest.Mock).mockReturnValue(false);

    whenPageIsRendered();

    const pageTitle = screen.getByText('Your card');
    expect(pageTitle).toBeInTheDocument();

    const requestNewCardBtn = within(pageTitle!.parentElement!).getByRole('button', {
      name: 'Request new card',
    });
    expect(requestNewCardBtn).toBeInTheDocument();

    const name = await screen.findByText(
      `${customerProfileCardGeneratedMock.firstName} ${customerProfileCardGeneratedMock.lastName}`
    );
    expect(name).toBeInTheDocument();

    const accNo = await screen.findByText(customerProfileCardGeneratedMock.card!.cardNumber!);
    expect(accNo).toBeInTheDocument();

    const formattedDate = formatDateDDMMYYYY(
      new Date(customerProfileCardGeneratedMock.card!.cardExpiry!).toString()
    );
    const date = screen.queryByText(formattedDate!);
    expect(date).toBeInTheDocument();

    jest.clearAllMocks();
  });

  test('displays NOT generated card page', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isSuccess: true,
      data: customerProfileCardNotGeneratedMock,
    });

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
    (useQuery as jest.Mock).mockReturnValue({
      isSuccess: true,
      data: customerProfileNoCardMock,
    });

    (useMedia as jest.Mock).mockReturnValue(false);

    whenPageIsRendered();

    const name = screen.queryByText(
      `${customerProfileNoCardMock.firstName} ${customerProfileNoCardMock.lastName}`
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
