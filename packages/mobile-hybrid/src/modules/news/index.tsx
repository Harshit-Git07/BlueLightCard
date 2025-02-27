import { FC } from 'react';
import useNews from '@/hooks/useNews';
import { newsPanelStore } from './store';
import InvokeNativeNavigation from '@/invoke/navigation';
import { useSetAtom } from 'jotai';
import NewsLayout from '@/components/NewsLayout/NewsLayout';
import { NAVIGATE_NEWS_URL } from '@/globals';

const navigation = new InvokeNativeNavigation();

/**
 * Preview news articles
 */
const NewsPreview: FC = () => {
  const setSeeAllNews = useSetAtom(newsPanelStore);

  const news = useNews(true);

  const onSeeAllClick = () => {
    document.getElementById('app-body')?.classList.add('noscroll');
    setSeeAllNews(true);
  };

  return (
    <NewsLayout
      news={news}
      onClickSeeAll={onSeeAllClick}
      onArticleClick={(articleId) => navigation.navigate(`${NAVIGATE_NEWS_URL}?id=${articleId}`)}
    />
  );
};

/**
 * Lists all news articles
 */
const NewsList: FC = () => {
  const news = useNews();

  return (
    <NewsLayout
      news={news}
      showHeading={false}
      onArticleClick={(articleId) => navigation.navigate(`${NAVIGATE_NEWS_URL}?id=${articleId}`)}
    />
  );
};

export { NewsPreview, NewsList };
