import Button from './';
import { ButtonProps } from './types';
import { faMinus, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { ThemeVariant } from '../../types';

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

    it('renders a borderless, inverted button', () => {
      const component = renderer.create(
        <Button borderless={true} invertColor={true} iconRight={faPlus}>
          Button
        </Button>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a button with a Tertiary Button', () => {
      const component = renderer.create(
        <Button variant={ThemeVariant.Tertiary} iconRight={faPlus}>
          Button
        </Button>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a button with a Secondary Button', () => {
      const component = renderer.create(
        <Button variant={ThemeVariant.Secondary} iconRight={faPlus}>
          Button
        </Button>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a Secondary button in disabled state button', () => {
      const component = renderer.create(
        <Button
          variant={ThemeVariant.Secondary}
          onClick={() => console.log()}
          disabled={true}
          withoutFocus={true}
          type={'submit'}
        >
          Button
        </Button>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a button with link as anchor tag', () => {
      const component = renderer.create(
        <Button variant={ThemeVariant.Secondary} type={'link'}>
          Button
        </Button>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
