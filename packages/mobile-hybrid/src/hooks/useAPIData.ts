import { AppContext } from '@/store';
import { useContext } from 'react';

export enum APIUrl {
  News = '/api/4/news/list.php',
  OfferPromos = '/api/4/offer/promos_new.php',
}

const useAPIData = (api: APIUrl) => {
  const { apiData } = useContext(AppContext);
  return apiData[api]?.data;
};

export default useAPIData;
