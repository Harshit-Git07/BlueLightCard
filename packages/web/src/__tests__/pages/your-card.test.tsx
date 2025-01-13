import '@testing-library/jest-dom/extend-expect';
import { NextRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import {
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '../../../../shared-ui/src/adapters';
import YourCardPage from '@/pages/your-card';

import { formatDateDDMMYYYY } from '../../../../shared-ui/src/utils/dates';

import * as globals from '@/global-vars';
import { mockMemberProfileResponse } from '@bluelightcard/shared-ui/components/MyAccountDebugTools/mocks/mockMemberProfileGet';

const mockProfileNoCard = { ...mockMemberProfileResponse };
mockProfileNoCard.cards = [];

const mockProfileNoCardNoApplication = { ...mockProfileNoCard };
mockProfileNoCardNoApplication.applications = [];

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

jest.mock('react-use', () => ({
  useMedia: jest.fn(),
}));

describe('MyCard Page', () => {
  beforeEach(() => {
    localStorage.setItem('username', 'test');
    jest.clearAllMocks();
  });

  const whenPageIsRendered = async (data?: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const mockPlatformAdapter = useMockPlatformAdapter(200, data);
    render(
      <QueryClientProvider client={new QueryClient()}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <RouterContext.Provider value={mockRouter as NextRouter}>
            <YourCardPage />
          </RouterContext.Provider>
        </PlatformAdapterProvider>
      </QueryClientProvider>
    );
    return mockPlatformAdapter;
  };

  test('displays generated card page', async () => {
    await whenPageIsRendered(mockMemberProfileResponse);

    const pageTitle = await screen.findByText('Your card');
    expect(pageTitle).toBeInTheDocument();

    const requestNewCardBtn = within(pageTitle!.parentElement!).getByRole('button', {
      name: 'Request new card',
    });
    expect(requestNewCardBtn).toBeInTheDocument();

    const name = await screen.findByText(
      `${mockMemberProfileResponse.firstName} ${mockMemberProfileResponse.lastName}`
    );
    expect(name).toBeInTheDocument();

    const accNo = await screen.findByText(mockMemberProfileResponse.cards[0].cardNumber!);
    expect(accNo).toBeInTheDocument();

    const formattedDate = formatDateDDMMYYYY(
      new Date(mockMemberProfileResponse.cards[0].expiryDate!).toString()
    );
    const date = screen.queryByText(formattedDate!);
    expect(date).toBeInTheDocument();
  });

  test('displays NOT generated card page', async () => {
    await whenPageIsRendered(mockProfileNoCard);

    const pageTitle = await screen.findByText('Your card');
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
