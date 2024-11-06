import { useEffect, useState } from 'react';
import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import { AmplitudeExperimentFlags } from '@/utils/amplitude/AmplitudeExperimentFlags';
import { BRAZE_SDK_ENDPOINT, BRAZE_SDK_API_KEY } from '@/global-vars';
import { LogContentCardClick, importBrazeFunctions } from '@/utils/braze/importBrazeFunctions';

export interface BrazeContentCard {
  id: string;
  title?: string;
  imageUrl?: string;
  url?: string;
  isControl: boolean;
  extras?: Record<string, string>;
  logClick: () => void;
}

export const useBrazeContentCards = (): BrazeContentCard[] => {
  const [contentCards, setContentCards] = useState<BrazeContentCard[]>([]);

  const brazeContentCardsEnabled = useAmplitudeExperiment(
    AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED,
    'control'
  );

  useEffect(() => {
    if (brazeContentCardsEnabled.data?.variantName !== 'treatment') return;

    const fetchContentCards = async () => {
      const {
        openSession,
        getCachedContentCards,
        subscribeToContentCardsUpdates,
        initialize,
        requestContentCardsRefresh,
        logContentCardClick,
      } = await importBrazeFunctions();

      initialize(BRAZE_SDK_API_KEY, {
        baseUrl: BRAZE_SDK_ENDPOINT,
        enableSdkAuthentication: true,
      });
      requestContentCardsRefresh();

      const cachedCards = getCachedContentCards();
      if (cachedCards.cards.length > 0) {
        setContentCards(mapContentCards(cachedCards.cards, logContentCardClick));
      }

      subscribeToContentCardsUpdates((cards) => {
        if (cards.cards.length > 0) {
          setContentCards(mapContentCards(cards.cards, logContentCardClick));
        }
      });
      openSession();
    };

    fetchContentCards();
  }, [brazeContentCardsEnabled.data?.variantName]);

  return contentCards;
};

const mapContentCards = (
  cards: any[],
  logContentCardClick: LogContentCardClick
): BrazeContentCard[] => {
  return cards.map((card) => {
    return {
      id: card.id,
      title: card.title ?? '',
      imageUrl: card.imageUrl ?? '',
      url: card.url ?? '',
      isControl: card.isControl,
      extras: card.extras,
      logClick: () => {
        logContentCardClick(card);
      },
    };
  });
};
