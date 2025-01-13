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

    it('renders a large button', () => {
      const component = renderer.create(
        <Button size={'Large'} iconRight={faPlus}>
          Button
        </Button>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders an XSmall button', () => {
      const component = renderer.create(
        <Button size={'XSmall'} iconRight={faPlus}>
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

    it('renders a button with href as anchor tag', () => {
      const component = renderer.create(<Button href={'/'}>Button</Button>);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a Tertiary button with no left or right padding', () => {
      const component = renderer.create(<Button variant={ThemeVariant.Tertiary}>Button</Button>);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a Tertiary Danger button with no left or right padding', () => {
      const component = renderer.create(
        <Button variant={ThemeVariant.TertiaryDanger}>Button</Button>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('only applies anchor props with href', () => {
      const { container: noNewTabContainer } = render(<Button href="/test">Button</Button>);
      const noNewTabButton = noNewTabContainer.querySelector('a');

      expect(noNewTabButton).toHaveProperty('href');
      expect(noNewTabButton).toHaveProperty('target', '');

      const { container: newTabContainer } = render(
        <Button href="/test" newTab>
          Button
        </Button>,
      );
      const newTabButton = newTabContainer.querySelector('a');

      expect(newTabButton).toHaveProperty('href');
      expect(newTabButton).toHaveProperty('target', '_blank');

      expect(noNewTabButton).not.toHaveProperty('onClick');
      expect(newTabButton).not.toHaveProperty('onClick');
    });

    it('only applies button props with onClick', () => {
      const { container } = render(<Button onClick={jest.fn()}>Button</Button>);
      const buttonElement = container.querySelector('button');

      expect(buttonElement).toHaveProperty('onclick');
      expect(buttonElement).toHaveProperty('type', 'button');

      expect(buttonElement).not.toHaveProperty('href');
    });
  });
});
