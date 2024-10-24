import MinimalFooter from './index';
import renderer from 'react-test-renderer';
import { env } from '../../env';

describe('MinimalFooter', () => {
  beforeEach(() => {
    jest.resetModules();
    env.APP_BRAND = 'blc-uk';
  });

  describe('snapshot Test', () => {
    it('renders a blc-uk footer', () => {
      const component = renderer.create(<MinimalFooter />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it('renders a blc-au footer', () => {
    env.APP_BRAND = 'blc-au';
    const component = renderer.create(<MinimalFooter />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders a dds-uk footer', () => {
    env.APP_BRAND = 'dds-uk';

    const component = renderer.create(<MinimalFooter />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
