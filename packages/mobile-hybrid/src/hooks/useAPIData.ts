import { APIUrl } from '@/globals';
import { AppContext } from '@/store';
import { useContext } from 'react';

const useAPIData = (api: APIUrl) => {
  const { apiData } = useContext(AppContext);
  return apiData[api]?.data;
};

export default useAPIData;
