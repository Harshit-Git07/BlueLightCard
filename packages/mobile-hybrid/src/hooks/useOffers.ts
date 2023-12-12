import { OfferDataModel } from '@/models/offer';
import useAPIData from './useAPIData';
import { APIUrl } from '@/globals';

const useOffers = (): OfferDataModel => {
  const data = useAPIData(APIUrl.OfferPromos) ?? {};
  return {
    deals: data?.deal ?? [],
    flexible: data?.flexible,
    groups: data?.groups ?? [],
  };
};

export default useOffers;
