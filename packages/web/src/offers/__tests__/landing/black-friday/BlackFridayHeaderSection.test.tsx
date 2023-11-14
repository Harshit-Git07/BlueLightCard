import renderer from 'react-test-renderer';

import BlackFridayHeaderSection from '@/offers/components/landing/black-friday/BlackFridayHeaderSection';

describe('BlackFridayHeaderSection', () => {
  it('should match snapshot', () => {
    const component = renderer.create(<BlackFridayHeaderSection />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
