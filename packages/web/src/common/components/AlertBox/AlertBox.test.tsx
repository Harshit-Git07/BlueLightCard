import AlertBox from '@/components/AlertBox/AlertBox';
import { AlertBoxProps } from '@/components/AlertBox/types';
import renderer from 'react-test-renderer';

describe('AlertBox component', () => {
  let props: AlertBoxProps;

  it('should render success alert', () => {
    const props = {
      alertType: 'success',
      title: 'Success Alert',
      description: 'This is a success message.',
    };

    const component = renderer.create(<AlertBox {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render info alert', () => {
    const props = {
      alertType: 'info',
      title: 'Info Alert',
      description: 'This is an info message.',
    };

    const component = renderer.create(<AlertBox {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render warning alert', () => {
    const props = {
      alertType: 'warning',
      title: 'Warning Alert',
      description: 'This is a warning message.',
    };

    const component = renderer.create(<AlertBox {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render danger alert', () => {
    const props = {
      alertType: 'danger',
      title: 'Error Alert',
      description: 'This is an error message.',
    };

    const component = renderer.create(<AlertBox {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
