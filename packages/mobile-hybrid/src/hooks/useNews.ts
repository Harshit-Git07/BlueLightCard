import { NewsModel } from '@/models/news';
import useAPIData from './useAPIData';
import { APIUrl } from '@/globals';

const useNews = (): NewsModel[] => {
  return useAPIData(APIUrl.News) ?? [];
};

export default useNews;
