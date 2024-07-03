import { render } from '@testing-library/react';
import BannerCarousel from './BannerCarousel';
import { CampaignCardProps } from './types';

const mockBanners: CampaignCardProps[] = [
  {
    image: 'https://picsum.photos/seed/picsum/200/300',
    linkUrl: 'https://google.com',
    name: 'Mock Banner One',
  },
  {
    image: 'https://picsum.photos/seed/picsum/200/300',
    linkUrl: 'https://google.com',
    name: 'Mock Banner Two',
  },
];

describe('BannerCarousel.tsx', () => {
  it('renders', () => {
    const { container } = render(<BannerCarousel banners={mockBanners} />);
    expect(container).toMatchSnapshot();
  });
});
