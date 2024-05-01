import { NewsModel } from '@/models/news';
import { APIUrl } from '@/globals';
import useAPI, { APIResponse } from './useAPI';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { newsStore } from '@/modules/news/store';

const useNews = (preview?: boolean): NewsModel[] => {
  const [news, setNews] = useAtom(newsStore);

  const response = useAPI(APIUrl.News) as APIResponse<NewsModel[]>;

  useEffect(() => {
    if (response?.data) {
      setNews(response.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response?.data]);

  return preview ? news.slice(0, 3) : news;
};

export default useNews;
