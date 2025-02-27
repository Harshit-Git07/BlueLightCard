import * as target from '../useBrazeContentCards';
import { useAmplitudeExperiment, Variant } from '@/context/AmplitudeExperiment';
import { UseDerivedQueryResult } from '@/hooks/useDerivedQuery';
import { RenderHookResult, RenderOptions, renderHook, waitFor } from '@testing-library/react';
import { importBrazeFunctions } from '@/utils/braze/importBrazeFunctions';
import UserContext from '@/context/User/UserContext';

jest.mock('@/context/AmplitudeExperiment');
jest.mock('@/utils/braze/importBrazeFunctions');

const useAmplitudeExperimentMock = jest.mocked(useAmplitudeExperiment);
const importBrazeFunctionsMock = jest.mocked(importBrazeFunctions);
const changeUserMock = jest.fn();
const logContentCardClickMock = jest.fn();

const contentCard = {
  id: '1',
  imageUrl: 'imageUrl',
  url: 'href',
  title: 'Test Braze card',
  isControl: false,
  extras: {},
  logClick: expect.any(Function),
};

const mockUserContext = {
  dislikes: [],
  error: undefined,
  isAgeGated: false,
  setUser: () => undefined,
  user: {
    companies_follows: [],
    legacyId: 'mock-legacy-id',
    profile: {
      dob: 'mock-dob',
      organisation: 'mock-organisation',
    },
    uuid: 'mock-uuid',
  },
};

const UserContextWrapper: RenderOptions['wrapper'] = ({ children }) => (
  <UserContext.Provider value={mockUserContext}>{children}</UserContext.Provider>
);

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

    it('should identify the user with the Braze SDK via user context', async () => {
      givenBrazeReturnsCachedContentCards();

      const contentCards = renderHook(() => target.useBrazeContentCards(), {
        wrapper: UserContextWrapper,
      });
      await thenContentCardsAreReturnedFromTheHook(contentCards);

      expect(changeUserMock).toHaveBeenCalledWith('mock-uuid');
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

    it('should log content card clicks to the Braze SDK', async () => {
      givenBrazeReturnsUpdatedContentCards();
      const brazeContentCards = renderHook(() => target.useBrazeContentCards());
      await thenContentCardsAreReturnedFromTheHook(brazeContentCards);

      brazeContentCards.result.current[0].logClick();

      expect(logContentCardClickMock).toHaveBeenCalledWith(contentCard);
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
        logContentCardClick: logContentCardClickMock,
        changeUser: changeUserMock,
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
        logContentCardClick: logContentCardClickMock,
        changeUser: changeUserMock,
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
