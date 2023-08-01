import { NewsModel } from '@/models/news';
import useAPIData, { APIUrl } from './useAPIData';

const useNews = (): NewsModel[] => {
  return useAPIData(APIUrl.News) ?? [];
};

export default useNews;
