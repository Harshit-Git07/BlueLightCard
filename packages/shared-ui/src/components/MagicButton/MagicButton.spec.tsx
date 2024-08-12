import { PlatformAdapterProvider, useMockPlatformAdapter } from 'src/adapters';
import MagicButton, { MagicBtnVariant } from './';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { faWandMagicSparkles } from '@fortawesome/pro-solid-svg-icons';

const mockPlatformAdapter = useMockPlatformAdapter();

describe('MagicButton component', () => {
  describe('smoke test', () => {
    it('should render component without error on primary variant', () => {
      render(
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <MagicButton variant={MagicBtnVariant.Primary} label="Button" />
        </PlatformAdapterProvider>,
      );

      const button = screen.getByRole('button');

      expect(button).toBeTruthy();
    });
  });

  describe('snapshot test for component variants', () => {
    it('should render component on pressed variant with no icon', () => {
      const component = renderer.create(
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <MagicButton
            variant={MagicBtnVariant.Pressed}
            label="Button"
            description="Button description"
          />
        </PlatformAdapterProvider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should render component on pressed variant with icon', () => {
      const component = renderer.create(
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <MagicButton
            variant={MagicBtnVariant.Pressed}
            label="Button"
            description="Button description"
            icon={faWandMagicSparkles}
          />
        </PlatformAdapterProvider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should render component on disabled variant', () => {
      const component = renderer.create(
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <MagicButton variant={MagicBtnVariant.Disabled} label="Button" />
        </PlatformAdapterProvider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
