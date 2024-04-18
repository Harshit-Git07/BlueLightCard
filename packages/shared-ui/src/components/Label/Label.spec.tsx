import Label from '.';
import { Props } from '.';
import renderer from 'react-test-renderer';

describe('Label component', () => {
  it('should render normal label', () => {
    const props: Props = {
      text: 'Online',
      type: 'normal',
    };
    const component = renderer.create(<Label {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render red label', () => {
    const props: Props = {
      text: '0/3 codes remaining',
      type: 'alert',
    };
    const component = renderer.create(<Label {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
