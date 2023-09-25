import PromoBanner from '@/offers/components/PromoBanner/PromoBanner';
import renderer from 'react-test-renderer';

describe('Promo Banner', () => {
  it('should render with the correct link and image url', () => {
    const component = renderer.create(<PromoBanner image="test.com" href="test.com" />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
