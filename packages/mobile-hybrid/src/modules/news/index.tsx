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

  const onSeeAllClick = () => {
    document.getElementById('app-body')?.classList.add('noscroll');
    setSeeAllNews(true);
  };

  return <NewsLayout news={previewNews} onClickSeeAll={onSeeAllClick} />;
};

/**
 * Lists all news articles
 */
const NewsList: FC = () => {
  const news = useNews();

  return <NewsLayout news={news} showHeading={false} />;
};

export { NewsPreview, NewsList };
