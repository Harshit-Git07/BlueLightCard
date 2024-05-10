import { PlatformAdapterProvider, useMockPlatformAdapter } from 'src/adapters';
import MagicButton from './';
import { Props } from './';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

const mockPlatformAdapter = useMockPlatformAdapter();

describe('Button component', () => {
  let props: Props;

  beforeEach(() => {
    props = {};
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <MagicButton {...props} />
        </PlatformAdapterProvider>,
      );

      const button = screen.getByRole('button');

      expect(button).toBeTruthy();
    });
  });

  describe('snapshot Test', () => {
    it('renders a button with animated border', () => {
      const component = renderer.create(
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <MagicButton variant="secondary" animate>
            Button
          </MagicButton>
          ,
        </PlatformAdapterProvider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a button that is diabled', () => {
      const component = renderer.create(
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <MagicButton variant="primary" disabled>
            Button
          </MagicButton>
          ,
        </PlatformAdapterProvider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
