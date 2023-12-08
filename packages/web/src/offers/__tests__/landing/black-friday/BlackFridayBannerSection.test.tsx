import renderer from 'react-test-renderer';

import BlackFridayBannerSection from '@/offers/components/landing/black-friday/BlackFridayBannerSection';
import blackFridayLandingPageConfig from '@/data/landing/blackFridayPageConfig';
import ReactDom from 'react-dom';

// Mocks the react-dom preload function
// Current version of NextJS has a bug where preload is attempted to be triggered in test envs
// which dont have the preload function on reactdom
// See: https://github.com/vercel/next.js/issues/53272
jest.mock('react-dom', () => ({
  ...jest.requireActual<typeof ReactDom>('react-dom'),
  preload: jest.fn(),
}));

describe('BlackFridayHeroSection', () => {
  it('should match snapshot', () => {
    const { bannerSection } = blackFridayLandingPageConfig;
    const component = renderer.create(<BlackFridayBannerSection {...bannerSection} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
