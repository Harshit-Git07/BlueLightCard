import React, { act } from 'react';
import Accordion, { Props } from './';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { faEye, faEyeSlash } from '@fortawesome/pro-solid-svg-icons';

// Mocking the FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, className }: { icon: any; className?: string }) => (
    <span data-testid="font-awesome-icon" data-icon={icon.iconName} className={className}>
      FontAwesomeIcon
    </span>
  ),
}));

describe('Accordion Component', () => {
  const setup = (props: Partial<Props> = {}) => {
    const defaultProps: Props = {
      title: 'Test Accordion',
      children: <div>Accordion Content</div>,
      groupId: 'group-1',
      isOpenDefault: false,
    };

    return render(<Accordion {...defaultProps} {...props} />);
  };

  const isContentHidden = (element: Element | null) => {
    return element?.getAttribute('aria-hidden') === 'true';
  };

  it('renders the title and is closed by default', () => {
    setup();
    const contentElement = screen.getByText('Accordion Content').closest('[aria-hidden]');

    expect(screen.getByText('Test Accordion')).toBeInTheDocument();
    expect(isContentHidden(contentElement)).toBe(true);
    expect(screen.getByTestId('font-awesome-icon')).toHaveAttribute('data-icon', 'plus');
  });

  it('toggles open and closed when clicked', async () => {
    setup();
    const button = screen.getByRole('button', { name: 'Expand content' });
    const contentElement = screen.getByText('Accordion Content').closest('[aria-hidden]');

    // Initially closed
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(isContentHidden(contentElement)).toBe(true);

    // Open accordion
    await act(async () => {
      await userEvent.click(button);
    });

    // After opening
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(isContentHidden(contentElement)).toBe(false);

    // Click again to close
    await act(async () => {
      await userEvent.click(button);
    });

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(isContentHidden(contentElement)).toBe(true);
  });

  it('applies correct aria attributes for accessibility', async () => {
    setup();

    const button = screen.getByRole('button', { name: 'Expand content' });
    const contentElement = screen.getByText('Accordion Content').closest('[aria-hidden]');

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(contentElement).toHaveAttribute('aria-hidden', 'true');

    // Open accordion
    await act(async () => {
      await userEvent.click(button);
    });

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(contentElement).toHaveAttribute('aria-hidden', 'false');
  });

  it('should disable focusable elements when closed and enable them when opened', async () => {
    setup({
      children: (
        <div>
          <button>Focusable Button</button>
          <a href="/">Focusable Link</a>
        </div>
      ),
    });

    const accordionButton = screen.getByRole('button', { name: 'Expand content' });
    const focusableButton = screen.getByText('Focusable Button');
    const focusableLink = screen.getByText('Focusable Link');

    // Initially, the focusable elements are hidden and disabled
    expect(focusableButton).toHaveAttribute('tabindex', '-1');
    expect(focusableLink).toHaveAttribute('tabindex', '-1');

    // Open the accordion
    await act(async () => {
      await userEvent.click(accordionButton);
    });

    // After opening, focusable elements should be enabled
    await waitFor(() => {
      expect(focusableButton).not.toHaveAttribute('tabindex');
      expect(focusableLink).not.toHaveAttribute('tabindex');
    });

    // Close the accordion
    await act(async () => {
      await userEvent.click(accordionButton);
    });

    // After closing, focusable elements should be disabled again
    await waitFor(() => {
      expect(focusableButton).toHaveAttribute('tabindex', '-1');
      expect(focusableLink).toHaveAttribute('tabindex', '-1');
    });
  });

  it('renders with custom icons if they are provided', async () => {
    setup({ openIcon: faEye, closeIcon: faEyeSlash });

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Expand content' }));
    });

    // Custom icons: faEye when closed, faEyeSlash when open
    expect(screen.getByTestId('font-awesome-icon')).toHaveAttribute('data-icon', 'eye-slash');
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Hide content' }));
    });
    expect(screen.getByTestId('font-awesome-icon')).toHaveAttribute('data-icon', 'eye');
  });

  it('supports initial default open state', () => {
    setup({ isOpenDefault: true });

    expect(screen.getByRole('button', { name: 'Hide content' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    const accordionContent = screen.getByText('Accordion Content').closest('[aria-hidden]');
    expect(isContentHidden(accordionContent)).toBe(false);
  });

  it('should allow only one accordion to be opened at a time within the same group', async () => {
    render(
      <>
        <Accordion title="Accordion 1" groupId="group1">
          Content 1
        </Accordion>
        <Accordion title="Accordion 2" groupId="group1">
          Content 2
        </Accordion>
      </>,
    );

    const accordion1Button = screen.getAllByRole('button', { name: 'Expand content' })[0];
    const accordion2Button = screen.getAllByRole('button', { name: 'Expand content' })[1];

    const accordion1Content = screen.getByText('Content 1').closest('[aria-hidden]');
    const accordion2Content = screen.getByText('Content 2').closest('[aria-hidden]');

    // Open first accordion
    await act(async () => {
      await userEvent.click(accordion1Button);
    });
    expect(isContentHidden(accordion1Content)).toBe(false);
    expect(isContentHidden(accordion2Content)).toBe(true);

    // Open second accordion (first should close)
    await act(async () => {
      await userEvent.click(accordion2Button);
    });
    expect(isContentHidden(accordion1Content)).toBe(true);
    expect(isContentHidden(accordion2Content)).toBe(false);
  });

  it('should allow multiple accordions with different groupId to be opened at the same time', async () => {
    render(
      <>
        <Accordion title="Accordion 1" groupId="group1">
          Content 1
        </Accordion>
        <Accordion title="Accordion 2" groupId="group2">
          Content 2
        </Accordion>
      </>,
    );

    const accordion1Button = screen.getAllByRole('button', { name: 'Expand content' })[0];
    const accordion2Button = screen.getAllByRole('button', { name: 'Expand content' })[1];

    const accordion1Content = screen.getByText('Content 1').closest('[aria-hidden]');
    const accordion2Content = screen.getByText('Content 2').closest('[aria-hidden]');

    // Open first accordion
    await act(async () => {
      await userEvent.click(accordion1Button);
    });
    expect(isContentHidden(accordion1Content)).toBe(false);

    // Open second accordion (both should remain open)
    await act(async () => {
      await userEvent.click(accordion2Button);
    });
    expect(isContentHidden(accordion1Content)).toBe(false);
    expect(isContentHidden(accordion2Content)).toBe(false);
  });

  it('should allow all accordions with no groupId to be opened simultaneously', async () => {
    render(
      <>
        <Accordion title="Accordion 1">Content 1</Accordion>
        <Accordion title="Accordion 2">Content 2</Accordion>
      </>,
    );

    const accordion1Button = screen.getAllByRole('button', { name: 'Expand content' })[0];
    const accordion2Button = screen.getAllByRole('button', { name: 'Expand content' })[1];

    const accordion1Content = screen.getByText('Content 1').closest('[aria-hidden]');
    const accordion2Content = screen.getByText('Content 2').closest('[aria-hidden]');

    // Open first accordion
    await act(async () => {
      await userEvent.click(accordion1Button);
    });
    expect(isContentHidden(accordion1Content)).toBe(false);

    // Open second accordion (both should remain open)
    await act(async () => {
      await userEvent.click(accordion2Button);
    });
    expect(isContentHidden(accordion1Content)).toBe(false);
    expect(isContentHidden(accordion2Content)).toBe(false);
  });

  it('should adjust the content height when the accordion is open', async () => {
    const { container } = setup();

    const button = screen.getByRole('button', { name: 'Expand content' });

    fireEvent.click(button);

    const contentWrapper = container.querySelector('[aria-hidden="false"]');
    const content = contentWrapper?.firstElementChild;
    expect(contentWrapper).toBeInTheDocument();
    expect(content).toBeInTheDocument();

    Object.defineProperty(content, 'offsetHeight', {
      configurable: true,
      value: 100,
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(contentWrapper).toHaveStyle('height: 100px');

    // Change the offsetHeight to simulate content change due to viewport resize
    Object.defineProperty(content, 'offsetHeight', {
      configurable: true,
      value: 200,
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(contentWrapper).toHaveStyle('height: 200px');
  });

  it('should not adjust the content height when the accordion is closed', () => {
    const { container } = setup();

    const contentWrapper = container.querySelector('[aria-hidden="true"]');
    expect(contentWrapper).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(contentWrapper).toHaveStyle('height: 0px');
  });

  it('should clean up resize event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = setup();

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});
