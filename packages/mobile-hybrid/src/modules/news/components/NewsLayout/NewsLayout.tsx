import { FC } from 'react';
import dayjs from 'dayjs';
import { NewsLayoutProps } from './types';
import Heading from '@/components/Heading/Heading';
import { cssUtil } from '@/utils/cssUtil';
import ListItem from '@/components/ListItem/ListItem';
import InvokeNativeNavigation from '@/invoke/navigation';

const formatDate = (date: string) => {
  return dayjs(date, 'YYYY-MM-DD HH:mm:ss').format('ddd DD MMM, YYYY');
};

const navigation = new InvokeNativeNavigation();

const NewsLayout: FC<NewsLayoutProps> = ({ news, showHeading = true, onClickSeeAll }) => {
  return (
    <>
      {showHeading && <Heading title="Latest news" onClickSeeAll={onClickSeeAll} />}
      {!!news.length && (
        <ul>
          {news.map((article, index) => {
            const classes = cssUtil([
              'py-3',
              index < news.length - 1 ? 'border-b dark:border-neutral-grey-100' : '',
            ]);
            return (
              <li className={classes} key={article.newsId}>
                <ListItem
                  className="ml-4"
                  title={article.title}
                  text={formatDate(article.when)}
                  imageSrc={article.s3image}
                  onClick={() => navigation.navigate(`/news/${article.nid}`)}
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
