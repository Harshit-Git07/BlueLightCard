import AlertBox from '@/components/AlertBox/AlertBox';
import { AlertBoxProps } from '@/components/AlertBox/types';
import renderer from 'react-test-renderer';

describe('AlertBox component', () => {
  it('should render success alert', () => {
    const props: AlertBoxProps = {
      alertType: 'success',
      title: 'Success Alert',
      description: 'This is a success message.',
    };

    const component = renderer.create(<AlertBox {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render info alert', () => {
    const props: AlertBoxProps = {
      alertType: 'info',
      title: 'Info Alert',
      description: 'This is an info message.',
    };

    const component = renderer.create(<AlertBox {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render warning alert', () => {
    const props: AlertBoxProps = {
      alertType: 'warning',
      title: 'Warning Alert',
      description: 'This is a warning message.',
    };

    const component = renderer.create(<AlertBox {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render danger alert', () => {
    const props: AlertBoxProps = {
      alertType: 'danger',
      title: 'Error Alert',
      description: 'This is an error message.',
    };

    const component = renderer.create(<AlertBox {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
