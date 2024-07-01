import renderer from 'react-test-renderer';
import Logo from './';

describe('Logo', () => {
  it('should render without error', () => {
    const tree = renderer.create(<Logo />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
