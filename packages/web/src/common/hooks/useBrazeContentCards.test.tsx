import * as target from './useBrazeContentCards';
import { useAmplitudeExperiment, Variant } from '@/context/AmplitudeExperiment';
import { UseDerivedQueryResult } from '@/hooks/useDerivedQuery';
import { renderHook, RenderHookResult, waitFor } from '@testing-library/react';
import { importBrazeFunctions } from '@/utils/braze/importBrazeFunctions';

jest.mock('@/context/AmplitudeExperiment');
jest.mock('@/utils/braze/importBrazeFunctions');

const useAmplitudeExperimentMock = jest.mocked(useAmplitudeExperiment);
const importBrazeFunctionsMock = jest.mocked(importBrazeFunctions);

const contentCard = {
  id: '1',
  imageUrl: 'imageUrl',
  href: 'href',
  isControl: false,
  extras: {},
};

describe('Use braze content cards', () => {
  describe('braze content cards feature flag disabled', () => {
    beforeEach(() => {
      givenFeatureFlagReturns('control');
    });

    it('should return an empty content card list', () => {
      const contentCards = renderHook(() => target.useBrazeContentCards());

      expect(contentCards.result.current).toStrictEqual([]);
    });
  });

  describe('braze content cards feature flag enabled', () => {
    beforeEach(() => {
      givenFeatureFlagReturns('treatment');
    });

    it('should return content cards if content cards returned from braze cache function', async () => {
      givenBrazeReturnsCachedContentCards();

      const contentCards = renderHook(() => target.useBrazeContentCards());

      await thenContentCardsAreReturnedFromTheHook(contentCards);
    });

    it('should return content cards if content cards returned from braze subscription function', async () => {
      givenBrazeReturnsUpdatedContentCards();

      const brazeContentCards = renderHook(() => target.useBrazeContentCards());

      await thenContentCardsAreReturnedFromTheHook(brazeContentCards);
    });
  });

  const givenFeatureFlagReturns = (value: string): void => {
    useAmplitudeExperimentMock.mockReturnValue({
      data: {
        variantName: value,
      },
    } as UseDerivedQueryResult<Variant, Error>);
  };

  const givenBrazeReturnsCachedContentCards = () => {
    importBrazeFunctionsMock.mockImplementation(() =>
      Promise.resolve({
        subscribeToContentCardsUpdates: jest.fn(),
        requestContentCardsRefresh: jest.fn(),
        openSession: jest.fn(),
        getCachedContentCards: () => ({
          cards: [contentCard, contentCard],
        }),
        initialize: jest.fn(),
      })
    );
  };

  const givenBrazeReturnsUpdatedContentCards = () => {
    importBrazeFunctionsMock.mockImplementation(() =>
      Promise.resolve({
        subscribeToContentCardsUpdates: (subscriber: (cards: any) => void) => {
          subscriber({
            cards: [contentCard, contentCard],
          });
          return 'id';
        },
        requestContentCardsRefresh: jest.fn(),
        openSession: jest.fn(),
        getCachedContentCards: () => ({
          cards: [],
        }),
        initialize: jest.fn(),
      })
    );
  };

  const thenContentCardsAreReturnedFromTheHook = async (
    contentCards: RenderHookResult<target.BrazeContentCard[], unknown>
  ) => {
    await waitFor(() => {
      expect(contentCards.result.current).toStrictEqual([contentCard, contentCard]);
    });
  };
});
