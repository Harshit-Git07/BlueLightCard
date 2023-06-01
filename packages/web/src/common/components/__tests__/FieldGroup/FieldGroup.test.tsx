import FieldGroup from '@/components/FieldGroup/FieldGroup';
import { FieldGroupProps } from '@/components/FieldGroup/types';
import { render, screen } from '@testing-library/react';

describe('FieldGroup component', () => {
  let props: FieldGroupProps;

  beforeEach(() => {
    props = {
      labelText: 'Field Group',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<FieldGroup {...props} />);
    });
  });

  describe('component rendering', () => {
    it('should render password visible icon', () => {
      props.password = true;
      render(<FieldGroup {...props} />);

      const passwordIcon = screen.getByRole('button', { name: 'Toggle password visibility' });

      expect(passwordIcon).toBeTruthy();
    });

    it('should render field as "weak" if messages contain invalid status', () => {
      props.password = true;
      props.message = [
        { invalid: true, message: 'Test one' },
        { invalid: true, message: 'Test two' },
      ];
      render(<FieldGroup {...props} />);

      const messageWeak = screen.getByText('Weak');

      expect(messageWeak).toBeTruthy();
    });

    it('should render field as "weak" if messages contain invalid status', () => {
      props.password = true;
      props.message = [
        { invalid: false, message: 'Test one' },
        { invalid: false, message: 'Test two' },
      ];
      render(<FieldGroup {...props} />);

      const messageWeak = screen.getByText('Strong');

      expect(messageWeak).toBeTruthy();
    });

    it('should NOT render any password UI', () => {
      props.password = false;
      props.message = 'Message';
      render(<FieldGroup {...props} />);

      const message = screen.getByText('Message');
      const passwordIcon = screen.queryByRole('button', { name: 'Toggle password visibility' });

      expect(message).toBeTruthy();
      expect(passwordIcon).toBeFalsy();
    });
  });
});
