import { OfferDataModel } from '@/models/offer';
import { APIUrl } from '@/globals';
import useAPI, { APIResponse } from './useAPI';
import { useSetAtom } from 'jotai';
import { spinner } from '@/modules/Spinner/store';
import { useEffect } from 'react';

const useOffers = (): OfferDataModel => {
  const setSpinner = useSetAtom(spinner);
  const response = useAPI(APIUrl.OfferPromos) as APIResponse<OfferDataModel>;

  useEffect(() => {
    if (response?.data) {
      setSpinner(false);
    }
  }, [response?.data, setSpinner]);

  return {
    deal: response?.data.deal ?? [],
    flexible: response?.data.flexible,
    groups: response?.data.groups ?? [],
  };
};

export default useOffers;
