import { useEffect, useState } from 'react';
import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import { AmplitudeExperimentFlags } from '@/utils/amplitude/AmplitudeExperimentFlags';
import { BRAZE_SDK_ENDPOINT, BRAZE_SDK_API_KEY } from '@/global-vars';
import { importBrazeFunctions } from '@/utils/braze/importBrazeFunctions';

export interface BrazeContentCard {
  id: string;
  imageUrl?: string;
  href?: string;
  isControl: boolean;
  extras?: Record<string, string>;
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
      } = await importBrazeFunctions();

      initialize(BRAZE_SDK_API_KEY, {
        baseUrl: BRAZE_SDK_ENDPOINT,
        enableSdkAuthentication: true,
      });
      requestContentCardsRefresh();

      const cachedCards = getCachedContentCards();
      if (cachedCards.cards.length > 0) {
        setContentCards(mapContentCards(cachedCards.cards));
      }

      subscribeToContentCardsUpdates((cards) => {
        if (cards.cards.length > 0) {
          setContentCards(mapContentCards(cards.cards));
        }
      });
      openSession();
    };

    fetchContentCards();
  }, [brazeContentCardsEnabled.data?.variantName]);

  return contentCards;
};

const mapContentCards = (cards: any[]): BrazeContentCard[] => {
  return cards.map((card) => {
    return {
      id: card.id,
      imageUrl: card.imageUrl ?? '',
      href: card.href ?? '',
      isControl: card.isControl,
      extras: card.extras,
    };
  });
};
