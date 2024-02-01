import MagicButton from '@/components/MagicButton/MagicButton';
import { MagicButtonProps } from '@/components/MagicButton/types';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

describe('Button component', () => {
  let props: MagicButtonProps;

  beforeEach(() => {
    props = {};
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<MagicButton {...props} />);

      const button = screen.getByRole('button');

      expect(button).toBeTruthy();
    });
  });

  describe('snapshot Test', () => {
    it('renders a button with animated border', () => {
      const component = renderer.create(
        <MagicButton variant="secondary" animate>
          Button
        </MagicButton>
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a button that is diabled', () => {
      const component = renderer.create(
        <MagicButton variant="primary" disabled>
          Button
        </MagicButton>
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
