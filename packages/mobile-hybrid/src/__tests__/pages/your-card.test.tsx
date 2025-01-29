import '@testing-library/jest-dom/extend-expect';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import {
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '../../../../shared-ui/src/adapters';
import MyCardPage from '@/pages/your-card';
import { formatDateDDMMYYYY } from '../../../../shared-ui/src/utils/dates';
import * as globals from '@/globals';
import { mockMemberProfileResponse } from '@bluelightcard/shared-ui/components/MyAccountDebugTools/mocks/mockMemberProfileGet';
import { PlatformVariant } from '@bluelightcard/shared-ui/types';

const mockProfileNoApplication = { ...mockMemberProfileResponse };
mockProfileNoApplication.applications = [];

const mockProfileNoCard = { ...mockMemberProfileResponse };
mockProfileNoCard.cards = [];

const mockProfileNoCardNoApplication = { ...mockProfileNoCard };
mockProfileNoCardNoApplication.applications = [];

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

describe('YourCard Page', () => {
  beforeEach(() => {
    window.localStorage.setItem('username', 'testMemberId');
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  const whenPageIsRendered = async (data?: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const mockPlatformAdapter = useMockPlatformAdapter(200, data, PlatformVariant.Web);
    render(
      <QueryClientProvider client={new QueryClient()}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <RouterContext.Provider value={mockRouter as NextRouter}>
            <MyCardPage />
          </RouterContext.Provider>
        </PlatformAdapterProvider>
      </QueryClientProvider>,
    );
    return mockPlatformAdapter;
  };

  test('displays request new card button when no application in progress', async () => {
    await whenPageIsRendered(mockProfileNoApplication);

    const requestNewCardBtn = await screen.findByRole('button', {
      name: 'Request new card',
    });
    expect(requestNewCardBtn).toBeInTheDocument();
  });

  test('displays continue card request button when no application in progress', async () => {
    await whenPageIsRendered(mockMemberProfileResponse);

    const requestNewCardBtn = await screen.findByRole('button', {
      name: 'Continue card request',
    });
    expect(requestNewCardBtn).toBeInTheDocument();
  });

  test('displays generated card page', async () => {
    await whenPageIsRendered(mockMemberProfileResponse);

    const name = await screen.findByText(
      `${mockMemberProfileResponse.firstName} ${mockMemberProfileResponse.lastName}`,
    );
    expect(name).toBeInTheDocument();

    const accNo = await screen.findByText(mockMemberProfileResponse.cards[0].cardNumber!);
    expect(accNo).toBeInTheDocument();

    const formattedDate = formatDateDDMMYYYY(
      new Date(mockMemberProfileResponse.cards[0].expiryDate!).toString(),
    );
    const date = screen.queryByText(formattedDate!);
    expect(date).toBeInTheDocument();
  });

  test('displays NOT generated card page', async () => {
    await whenPageIsRendered(mockProfileNoCard);

    const defaultAccNo = await screen.findByText('BLC0000000');
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
    await whenPageIsRendered(mockProfileNoCardNoApplication);

    const name = screen.queryByText(`${mockProfileNoCard.firstName} ${mockProfileNoCard.lastName}`);
    expect(name).not.toBeInTheDocument();

    const copyBtn = screen.queryByRole('button', { name: 'copy' });
    expect(copyBtn).not.toBeInTheDocument();

    const requestNewCardBtn = screen.queryByRole('button', { name: 'Request new card' });
    expect(requestNewCardBtn).not.toBeInTheDocument();

    const youDontHaveACard = await screen.findByText("You don't have a card yet");
    expect(youDontHaveACard).toBeInTheDocument();

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
    describe(`when the brand is '${brand}'`, () => {
      it(`should display: ${message}`, async () => {
        mockGlobals.BRAND = brand;

        await whenPageIsRendered(mockProfileNoCardNoApplication);

        const messageElement = await screen.findByText(message);
        expect(messageElement).toBeInTheDocument();
      });
    });
  });
});
