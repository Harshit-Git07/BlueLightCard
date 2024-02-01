import Label from '@/components/Label/Label';
import { LabelProps } from '@/components/Label/types';
import renderer from 'react-test-renderer';

describe('Label component', () => {
  let props: LabelProps;

  it('should render normal label', () => {
    const props = {
      text: 'Online',
      type: 'normal',
    };
    const component = renderer.create(<Label {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render red label', () => {
    const props = {
      text: '0/3 codes remaining',
      type: 'alert',
    };
    const component = renderer.create(<Label {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
