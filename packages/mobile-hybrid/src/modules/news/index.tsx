import { FC, useContext } from 'react';
import useNews from '@/hooks/useNews';
import NewsLayout from './components/NewsLayout/NewsLayout';
import { NewsModuleStore } from './store';

/**
 * Preview news articles
 */
const NewsPreview: FC = () => {
  const { setSeeAllNews } = useContext(NewsModuleStore);
  const news = useNews();
  const previewNews = news.slice(0, 3);

  return <NewsLayout news={previewNews} onClickSeeAll={() => setSeeAllNews(true)} />;
};

/**
 * Lists all news articles
 */
const NewsList: FC = () => {
  const { setSeeAllNews } = useContext(NewsModuleStore);
  const news = useNews();

  return <NewsLayout news={news} showHeading={false} onClickSeeAll={() => setSeeAllNews(false)} />;
};

export { NewsPreview, NewsList };
