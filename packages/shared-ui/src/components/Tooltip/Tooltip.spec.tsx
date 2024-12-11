import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import Tooltip from './index';

type PosType = 'right' | 'left' | 'top' | 'bottom';

describe('Tooltip Component', () => {
  const tooltipText = 'Hover over me to show my tooltip';

  const setup = (position: PosType = 'right', isOpen = false) => {
    return render(
      <Tooltip position={position} text="Tooltip Text" htmlFor="tooltip-target" isOpen={isOpen}>
        <span id="tooltip-target">{tooltipText}</span>
      </Tooltip>,
    );
  };

  it('should render the component without error', () => {
    setup();
  });

  it.each([
    ['top', 'bottom-full'],
    ['bottom', 'top-full'],
    ['left', 'right-full'],
    ['right', 'left-full'],
  ])('should show the tooltip at the %s when hovered over', async (pos, posStyle) => {
    const { getByText, getByRole } = setup(pos as PosType);

    const textElement = getByText(tooltipText);
    userEvent.hover(textElement);

    await waitFor(() => {
      const tooltipElement = getByRole('tooltip');
      expect(tooltipElement).toBeVisible();
      expect(tooltipElement).toHaveClass('absolute');
      expect(tooltipElement).toHaveClass(posStyle);
    });
  });

  it('should show the tooltip when isOpen is true', async () => {
    const { getByRole } = setup('right', true);

    const tooltipElement = getByRole('tooltip');
    expect(tooltipElement).toBeVisible();
  });

  it('Should fallback to hover behavior when isOpen is false', async () => {
    const tooltip = 'Tooltip Text';

    const { getByText, getByRole } = setup();

    const tooltipElement = getByRole('tooltip', { name: tooltip });

    // Initially, the tooltip should not be visible
    expect(tooltipElement).toHaveClass('opacity-0');

    // Hover over the target element
    const targetElement = getByText(tooltipText);
    await userEvent.hover(targetElement);

    expect(tooltipElement).toBeVisible();
  });
});
