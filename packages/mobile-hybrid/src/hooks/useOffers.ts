import { OfferDataModel } from '@/models/offer';
import useAPIData, { APIUrl } from './useAPIData';

const useOffers = (): OfferDataModel => {
  const data = useAPIData(APIUrl.OfferPromos) ?? {};
  return {
    deals: data?.deal ?? [],
    flexible: data?.flexible,
    groups: data?.groups ?? [],
  };
};

export default useOffers;
