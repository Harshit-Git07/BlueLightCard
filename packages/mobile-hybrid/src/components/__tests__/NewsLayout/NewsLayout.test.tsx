import NewsLayout, { formatDate } from '@/components/NewsLayout/NewsLayout';
import { NewsModel } from '@/models/news';
import { fireEvent, render, screen } from '@testing-library/react';

// Mocking Next Image allows us to input a fake url for testing purposes
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} alt="" />;
  },
}));

const mockNews: NewsModel[] = [
  {
    body: 'This is the news body',
    image: 'image/url',
    s3image: 's3/image/url',
    newsId: 'newsId1234',
    nid: 1,
    title: 'News Title',
    when: '2022-12-9',
  },
];

describe('NewsLayout.tsx', () => {
  describe('formatDate', () => {
    it('should return a string date formatted correctly', () => {
      const date = '2022-12-9';
      expect(formatDate(date)).toStrictEqual('Fri 09 Dec, 2022');
    });
    it('should return invalid date if an empty string is passed', () => {
      const emptyString = '';
      expect(formatDate(emptyString)).toStrictEqual('Invalid Date');
    });
  });

  it('renders, showing the heading by default', () => {
    const { container } = render(
      <NewsLayout news={mockNews} onArticleClick={jest.fn()} onClickSeeAll={jest.fn()} />,
    );
    expect(container).toMatchSnapshot();
    expect(screen.getByText('Latest news')).toBeDefined();
  });

  it('should not show the heading when set to false', () => {
    render(
      <NewsLayout
        news={mockNews}
        onArticleClick={jest.fn()}
        onClickSeeAll={jest.fn()}
        showHeading={false}
      />,
    );
    expect(screen.queryByText('Latest news')).toBeNull();
  });

  it('should call the onClickSeeAll function when the heading is clicked', async () => {
    const onClick = jest.fn();
    render(<NewsLayout news={mockNews} onArticleClick={jest.fn()} onClickSeeAll={onClick} />);
    const heading = screen.getByText('See all');
    await fireEvent.click(heading);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should call the onArticleClick with the id of the article', async () => {
    const onArticleClick = jest.fn();
    render(
      <NewsLayout news={mockNews} onArticleClick={onArticleClick} onClickSeeAll={jest.fn()} />,
    );
    const newsArticle = screen.getByText(mockNews[0].title);
    await fireEvent.click(newsArticle);
    expect(onArticleClick).toHaveBeenCalledWith(mockNews[0].newsId);
  });
});
