import { NewsModel } from '@/models/news';

export interface NewsLayoutProps {
  news: NewsModel[];
  showHeading?: boolean;
  onClickSeeAll?: () => void;
}
