import MinimalFooter from './index';
import renderer from 'react-test-renderer';
import { env } from '../../env';

describe('MinimalFooter', () => {
  const originalEnv = process.env;
  console.log('originalEnv', originalEnv);
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
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
    console.log('dds env', process.env.NEXT_PUBLIC_APP_BRAND);
    const component = renderer.create(<MinimalFooter />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
