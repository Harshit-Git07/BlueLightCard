import renderer from 'react-test-renderer';

import BlackFridayBannerSection from '@/offers/components/landing/black-friday/BlackFridayBannerSection';
import blackFridayLandingPageConfig from '@/data/landing/blackFridayPageConfig';

describe('BlackFridayHeroSection', () => {
  it('should match snapshot', () => {
    const { bannerSection } = blackFridayLandingPageConfig;
    const component = renderer.create(<BlackFridayBannerSection {...bannerSection} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
