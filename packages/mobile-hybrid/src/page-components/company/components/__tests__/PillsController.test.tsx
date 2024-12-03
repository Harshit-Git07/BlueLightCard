import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { fireEvent, render, RenderOptions, waitFor, screen } from '@testing-library/react';
import { Suspense } from 'react';

import { Offer } from '@blc/offers-cms/api/schema';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '@bluelightcard/shared-ui';
import { createFactoryMethod } from '@/utils/createFactoryMethod';
import PillsController from '../PillsController';
import { selectedFilter } from '../../atoms';
import { FiltersType } from '../../types';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';

jest.mock('@/hooks/useCmsEnabled', () => ({
  useCmsEnabled: jest.fn().mockReturnValue(true),
}));

const notSelectedPillClass =
  'bg-pill-default-bg-colour-light dark:bg-pill-default-bg-colour-dark text-pill-default-label-colour-light dark:text-pill-default-label-colour-dark';
const selectedPillClass =
  'bg-pill-selected-bg-colour-light dark:bg-pill-selected-bg-colour-dark text-pill-selected-label-colour-light dark:text-pill-selected-label-colour-dark';
const offerFilters = [
  { offerType: 'gift-card', text: 'Gift Card' },
  { offerType: 'in-store', text: 'In-store' },
  { offerType: 'online', text: 'Online' },
  { offerType: 'local', text: 'Local' },
  { offerType: 'other', text: 'Other' },
  { offerType: 'ticket', text: 'Ticket' },
  { offerType: 'All', text: 'All' },
] as const;
const buttonText = offerFilters.map((filter) => filter.text);
const companyId = '123';

const createOffer = createFactoryMethod<Offer>({
  companyId,
  description: null,
  expires: '2022-01-01T00:00:00',
  id: '1',
  image: 'offer1.jpg',
  name: 'Offer 1',
  type: 'online',
  termsAndConditions: null,
});
const createAllOfferTypes = () => {
  const offerTypes = ['online', 'in-store', 'local', 'gift-card', 'other', 'ticket'] as const;
  return offerTypes.map((type, index) =>
    createOffer({
      id: index.toString(),
      name: `Offer ${index + 1}`,
      type,
    }),
  );
};

describe('PillsController', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();
  const createWrapper = (initialFilter: FiltersType): RenderOptions['wrapper'] =>
    function Wrapper({ children }) {
      return (
        <QueryClientProvider client={new QueryClient()}>
          <PlatformAdapterProvider adapter={mockPlatformAdapter}>
            <JotaiTestProvider initialValues={[[selectedFilter, initialFilter]]}>
              <Suspense fallback="loading">{children}</Suspense>
            </JotaiTestProvider>
          </PlatformAdapterProvider>
        </QueryClientProvider>
      );
    };

  const renderComponent = (companyId: string, initialFilter: FiltersType) =>
    render(<PillsController companyId={companyId} />, { wrapper: createWrapper(initialFilter) });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each(offerFilters)(
    'should mark the $offerType button as selected when the filter is set to $text',
    async (buttonToClick) => {
      mockPlatformAdapter.invokeV5Api.mockResolvedValueOnce({
        status: 200,
        data: JSON.stringify(createAllOfferTypes()),
      });
      renderComponent(companyId, buttonToClick.offerType);

      await waitFor(() => {
        buttonText.forEach((text) => {
          const button = screen.getByText(text);
          if (text === buttonToClick.text) {
            expect(button).toHaveClass(selectedPillClass);
          } else {
            expect(button).toHaveClass(notSelectedPillClass);
          }
        });
      });
    },
  );

  it.each([
    ['online', 'Online'],
    ['in-store', 'In-store'],
    ['local', 'Local'],
    ['gift-card', 'Gift Card'],
    ['other', 'Other'],
    ['ticket', 'Ticket'],
  ] as const)(
    'should enable the %s button when there are offers of that type',
    async (currentType, currentText) => {
      const offers = [
        createOffer({ id: '1', name: 'Offer 1', image: 'offer1.jpg', type: currentType }),
        createOffer({
          id: '1',
          name: 'Offer 1',
          image: 'offer1.jpg',
          type: 'some-type' as Offer['type'],
        }),
        createOffer({
          id: '1',
          name: 'Offer 1',
          image: 'offer1.jpg',
          type: 'another-type' as Offer['type'],
        }),
      ];

      mockPlatformAdapter.invokeV5Api.mockResolvedValueOnce({
        status: 200,
        data: JSON.stringify(offers),
      });

      renderComponent(companyId, 'All');

      await waitFor(() => {
        buttonText.forEach((text) => {
          const button = screen.getByText(text);
          if (text === 'All' || text === currentText) {
            expect(button).not.toBeDisabled();
          } else {
            expect(button).toBeDisabled();
          }
        });
      });
    },
  );

  it('should not take action when a disabled button is clicked', async () => {
    mockPlatformAdapter.invokeV5Api.mockResolvedValueOnce({
      status: 200,
      data: JSON.stringify([]),
    });

    renderComponent(companyId, 'All');

    await waitFor(() => {
      const button = screen.getByText('Gift Card');
      fireEvent.click(button);
    });
    await waitFor(() => {
      const button = screen.getByText('Gift Card');
      expect(button).toBeDisabled();
    });
  });

  it.each(offerFilters)(
    'should set the selected filter to $text when the $text button is clicked',
    async (buttonToClick) => {
      mockPlatformAdapter.invokeV5Api.mockResolvedValueOnce({
        status: 200,
        data: JSON.stringify(createAllOfferTypes()),
      });

      renderComponent(companyId, 'All');

      await waitFor(() => {
        const button = screen.getByText(buttonToClick.text);
        fireEvent.click(button);
      });
      await waitFor(() => {
        const button = screen.getByText(buttonToClick.text);
        expect(button).toHaveClass(selectedPillClass);
      });
    },
  );
});
