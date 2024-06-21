import dayjs from 'dayjs';
import { NewsLayoutProps } from './types';
import Heading from '@/components/Heading/Heading';
import { cssUtil } from '@/utils/cssUtil';
import ListItem from '@/components/ListItem/ListItem';
import { FC } from 'react';

export const formatDate = (date: string) => {
  return dayjs(date, 'YYYY-MM-DD HH:mm:ss').format('ddd DD MMM, YYYY');
};

const NewsLayout: FC<NewsLayoutProps> = ({
  news,
  showHeading = true,
  onClickSeeAll,
  onArticleClick,
}) => {
  return (
    <>
      {showHeading && <Heading title="Latest news" onClickSeeAll={onClickSeeAll} />}
      {!!news.length && (
        <ul>
          {news.map((article, index) => {
            const classes = cssUtil([
              'py-3',
              index < news.length - 1
                ? 'border-b border-listItem-divider-colour-light dark:border-listItem-divider-colour-dark'
                : '',
            ]);
            return (
              <li className={classes} key={article.newsId}>
                <ListItem
                  className="ml-4"
                  title={article.title}
                  text={formatDate(article.when)}
                  imageSrc={article.s3image}
                  onClick={() => onArticleClick(article.newsId)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default NewsLayout;
