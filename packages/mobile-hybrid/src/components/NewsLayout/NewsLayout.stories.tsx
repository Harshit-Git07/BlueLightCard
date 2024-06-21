import { Meta, StoryFn } from '@storybook/react';
import tokenMigrationDecorator from '@storybook/tokenMigrationDecorator';
import NewsLayout, { formatDate } from './NewsLayout';
import { NewsModel } from '@/models/news';

const componentMeta: Meta = {
  title: 'Layouts/NewsLayout',
  component: NewsLayout,
  decorators: [tokenMigrationDecorator],
  argTypes: {
    newsOne: {
      name: 'Show News Item One',
      control: 'boolean',
    },
    newsOneId: {
      name: 'News Item One ID',
      control: 'string',
      if: {
        arg: 'newsOne',
      },
    },
    newsOneDate: {
      name: 'News Item One Date',
      control: 'date',
      if: {
        arg: 'newsOne',
      },
    },
    newsOneTitle: {
      name: 'News Item One Title',
      control: 'string',
      if: {
        arg: 'newsOne',
      },
    },
    newsOneBody: {
      name: 'News Item One Body',
      control: 'string',
      if: {
        arg: 'newsOne',
      },
    },
    newsOneImage: {
      name: 'News Item One Image',
      control: 'string',
      if: {
        arg: 'newsOne',
      },
    },
    newsTwo: {
      name: 'Show News Item Two',
      control: 'boolean',
    },
    newsTwoId: {
      name: 'News Item Two ID',
      control: 'string',
      if: {
        arg: 'newsTwo',
      },
    },
    newsTwoDate: {
      name: 'News Item Two Date',
      control: 'date',
      if: {
        arg: 'newsTwo',
      },
    },
    newsTwoTitle: {
      name: 'News Item Two Title',
      control: 'string',
      if: {
        arg: 'newsTwo',
      },
    },
    newsTwoBody: {
      name: 'News Item Two Body',
      control: 'string',
      if: {
        arg: 'newsTwo',
      },
    },
    newsTwoImage: {
      name: 'News Item Two Image',
      control: 'string',
      if: {
        arg: 'newsTwo',
      },
    },
  },
  parameters: {
    controls: {
      exclude: ['news', 'onClickSeeAll', 'onArticleClick'],
    },
  },
};

const DefaultTemplate: StoryFn = ({
  showHeading,
  newsOne,
  newsOneId,
  newsOneDate,
  newsOneTitle,
  newsOneBody,
  newsOneImage,
  newsTwo,
  newsTwoId,
  newsTwoDate,
  newsTwoTitle,
  newsTwoBody,
  newsTwoImage,
}) => {
  const news: NewsModel[] = [];
  if (newsOne) {
    news.push({
      nid: 1,
      body: newsOneBody,
      image: newsOneImage,
      s3image: newsOneImage,
      newsId: newsOneId,
      title: newsOneTitle,
      when: formatDate(newsOneDate),
    });
  }
  if (newsTwo) {
    news.push({
      nid: 2,
      body: newsTwoBody,
      image: newsTwoImage,
      s3image: newsTwoImage,
      newsId: newsTwoId,
      title: newsTwoTitle,
      when: formatDate(newsTwoDate),
    });
  }
  return (
    <NewsLayout
      news={news}
      onArticleClick={(articleid) => alert(`Article with ID: ${articleid} clicked!`)}
      onClickSeeAll={() => alert(`See All Clicked!`)}
      showHeading={showHeading}
    />
  );
};

export const Default = DefaultTemplate.bind({});

Default.args = {
  showHeading: true,
  newsOne: true,
  newsOneId: 'news-one-id',
  newsOneDate: '2023-12-12',
  newsOneTitle: 'News One Title',
  newsOneBody: 'This is the news one body text',
  newsOneImage: 'https://picsum.photos/600/250',
  newsTwo: false,
  newsTwoId: '',
  newsTwoDate: '',
  newsTwoTitle: '',
  newsTwoBody: '',
  newsTwoImage: '',
};

export default componentMeta;
