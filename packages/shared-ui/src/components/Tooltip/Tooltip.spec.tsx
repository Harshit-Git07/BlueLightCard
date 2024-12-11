import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import Tooltip from './index';

describe('Tooltip Component', () => {
  it('Should render the component without error', () => {
    render(
      <Tooltip position="right" text="Tooltip Text">
        <span>Hover over me</span>
      </Tooltip>,
    );
  });

  it('Should show the tooltip top of the component when the mouse over', async () => {
    const text = 'Hover over me to show my tooltip';

    const { getByText } = render(
      <Tooltip position="top" text="Tooltip Text">
        <span>{text}</span>
      </Tooltip>,
    );

    const textElement = getByText(text);

    userEvent.hover(textElement);

    await waitFor(() => {
      const tooltipElement = screen.getByRole('tooltip');
      expect(tooltipElement).toBeVisible();

      expect(tooltipElement).toHaveClass('absolute');
      expect(tooltipElement).toHaveClass('bottom-full');
    });
  });

  it('Should show the tooltip bottom of the component when the mouse over', async () => {
    const text = 'Hover over me to show my tooltip';

    const { getByText } = render(
      <Tooltip position="bottom" text="Tooltip Text">
        <span>{text}</span>
      </Tooltip>,
    );

    const textElement = getByText(text);

    userEvent.hover(textElement);

    await waitFor(() => {
      const tooltipElement = screen.getByRole('tooltip');
      expect(tooltipElement).toBeVisible();

      expect(tooltipElement).toHaveClass('absolute');
      expect(tooltipElement).toHaveClass('top-full');
    });
  });

  it('Should show the tooltip left of the component when the mouse over', async () => {
    const text = 'Hover over me to show my tooltip';

    const { getByText } = render(
      <Tooltip position="left" text="Tooltip Text">
        <span>{text}</span>
      </Tooltip>,
    );

    const textElement = getByText(text);

    userEvent.hover(textElement);

    await waitFor(() => {
      const tooltipElement = screen.getByRole('tooltip');
      expect(tooltipElement).toBeVisible();

      expect(tooltipElement).toHaveClass('absolute');
      expect(tooltipElement).toHaveClass('right-full');
    });
  });

  it('Should show the tooltip right of the component when the mouse over', async () => {
    const text = 'Hover over me to show my tooltip';

    const { getByText } = render(
      <Tooltip position="right" text="Tooltip Text">
        <span>{text}</span>
      </Tooltip>,
    );

    const textElement = getByText(text);

    userEvent.hover(textElement);

    await waitFor(() => {
      const tooltipElement = screen.getByRole('tooltip');
      expect(tooltipElement).toBeVisible();

      expect(tooltipElement).toHaveClass('absolute');
      expect(tooltipElement).toHaveClass('left-full');
    });
  });

  it('Should show the tooltip when isOpen property is set to true', async () => {
    const text = 'My tooltip is displayed by default';

    render(
      <Tooltip position="right" text="Tooltip Text" isOpen={true}>
        <span>{text}</span>
      </Tooltip>,
    );

    const tooltipElement = screen.getByRole('tooltip');
    expect(tooltipElement).toBeVisible();
  });

  it('Should fallback to default hover behavior when isOpen property is set to false', async () => {
    const text = 'My tooltip is displayed by default';

    const { getByText } = render(
      <Tooltip position="right" text="Tooltip Text" isOpen={false}>
        <span>{text}</span>
      </Tooltip>,
    );

    const tooltipElement = screen.getByRole('tooltip');
    expect(tooltipElement).toBeVisible();

    const textElement = getByText(text);

    userEvent.hover(textElement);

    await waitFor(() => {
      const tooltipElement = screen.getByRole('tooltip');
      expect(tooltipElement).toBeVisible();

      expect(tooltipElement).toHaveClass('absolute');
      expect(tooltipElement).toHaveClass('left-full');
    });
  });
});
