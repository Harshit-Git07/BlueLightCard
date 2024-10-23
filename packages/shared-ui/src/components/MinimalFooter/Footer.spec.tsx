import MinimalFooter from './index';
import renderer from 'react-test-renderer';

describe('MinimalFooter', () => {
  describe('snapshot Test', () => {
    it('renders a blc-uk footer', () => {
      const component = renderer.create(<MinimalFooter />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it('renders a blc-au footer', () => {
    process.env.NEXT_PUBLIC_APP_BRAND = 'blc-au';
    const component = renderer.create(<MinimalFooter />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders a dds-uk footer', () => {
    process.env.NEXT_PUBLIC_APP_BRAND = 'dds-uk';
    const component = renderer.create(<MinimalFooter />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
