import Button from '@/components/Button/Button';
import { ButtonProps } from '@/components/Button/types';
import { faMinus, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import 'jest-styled-components'

describe('Button component', () => {
  let props: ButtonProps;

  beforeEach(() => {
    props = {
      text: 'Button',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Button {...props} />);

      const button = screen.getByRole('button');

      expect(button).toBeTruthy();
    });
  });

  describe('Snapshot Test', () => {
    it('renders a button with the correct icon side "left"', () => {
      const component = renderer.create(
        <Button text="Button" iconLeft={faMinus}/>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a button with the correct icon side "right"', () => {
      const component = renderer.create(
        <Button text="Button" iconRight={faPlus}/>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
