import { createLabels } from '../../../hooks/useLabels';
import { usePlatformAdapter } from '../../../adapters';
import { useSharedUIConfig } from '../../../providers';
import { queryOptions } from '@tanstack/react-query';
import { getOffer } from '../../../api/offers';
import { Messages } from '../../../utils/messages';

export function offerDetailsQuery(offerId: number) {
  const adapter = usePlatformAdapter();
  const config = useSharedUIConfig();

  return queryOptions({
    queryKey: ['offer-details', offerId],
    retry(failureCount, error) {
      if (error.message === Messages.OFFER_NOT_FOUND) {
        return false;
      }

      return failureCount < 3;
    },

    queryFn: async () => {
      const offer = await getOffer(adapter, offerId);
      const labels = createLabels(offer);

      const urlContainsImage = /\.(jpe?g|png|gif|bmp)$/i.test(offer.companyLogo);
      if (!urlContainsImage) {
        offer.companyLogo = `${config.globalConfig.cdnUrl}/companyimages/complarge/retina/${offer.companyId}.jpg`;
      }

      return { ...offer, ...{ labels } };
    },
  });
}
