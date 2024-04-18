import Button from './';
import { ButtonProps } from './types';
import { faMinus, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

describe('Button component', () => {
  let props: ButtonProps;

  beforeEach(() => {
    props = {};
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Button {...props} />);

      const button = screen.getByRole('button');

      expect(button).toBeTruthy();
    });
  });

  describe('snapshot Test', () => {
    it('renders a button with the correct icon side "left"', () => {
      const component = renderer.create(<Button iconLeft={faMinus}>Button</Button>);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a button with the correct icon side "right"', () => {
      const component = renderer.create(<Button iconRight={faPlus}>Button</Button>);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
