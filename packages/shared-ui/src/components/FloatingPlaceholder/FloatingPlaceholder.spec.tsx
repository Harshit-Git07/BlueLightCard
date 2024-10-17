import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FloatingPlaceholder from './';
import '@testing-library/jest-dom';

jest.mock('../../tailwind/theme', () => ({
  colours: {
    textOnSurface: 'mock-colour',
    textOnSurfaceDisabled: 'mock-colour-disabled',
  },
  fonts: {
    body: 'mocked-font-style',
    bodyLight: 'mocked-light-font-style',
  },
}));

describe('FloatingPlaceholder', () => {
  const defaultProps = {
    text: 'Test Label',
    targetId: 'test-input',
    isFieldDisabled: false,
  };

  it('renders with default props', () => {
    render(
      <FloatingPlaceholder {...defaultProps}>
        <input type="text" />
      </FloatingPlaceholder>,
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test-input');
  });

  it('applies correct classes when not focused and empty', () => {
    render(
      <FloatingPlaceholder {...defaultProps}>
        <input type="text" />
      </FloatingPlaceholder>,
    );

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('top-1/2 -translate-y-1/2 py-[12px]');
    expect(label).not.toHaveClass('top-[4px] text-xs mocked-light-font-style');
  });

  it('applies correct classes when focused', async () => {
    const user = userEvent.setup();
    render(
      <FloatingPlaceholder {...defaultProps}>
        <input type="text" />
      </FloatingPlaceholder>,
    );

    const input = screen.getByRole('textbox');
    await user.click(input);

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('top-[4px] text-xs mocked-light-font-style');
    expect(label).not.toHaveClass('top-1/2 -translate-y-1/2 py-[12px]');
  });

  it('applies correct classes when not focused but has value', async () => {
    const user = userEvent.setup();
    render(
      <FloatingPlaceholder {...defaultProps}>
        <input type="text" />
      </FloatingPlaceholder>,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'Test Value');
    await user.tab();

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('top-[4px] text-xs mocked-light-font-style');
    expect(label).not.toHaveClass('top-1/2 -translate-y-1/2 py-[12px]');
  });

  it('handles disabled state correctly', () => {
    render(
      <FloatingPlaceholder {...defaultProps} isFieldDisabled={true}>
        <input type="text" disabled />
      </FloatingPlaceholder>,
    );

    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('aria-hidden', 'true');
    expect(label).toHaveAttribute('aria-disabled', 'true');
    expect(label.classList.contains('mock-colour-disabled')).toBe(true);
  });

  it('handles input events correctly', async () => {
    const user = userEvent.setup();
    render(
      <FloatingPlaceholder {...defaultProps}>
        <input type="text" />
      </FloatingPlaceholder>,
    );

    const input = screen.getByRole('textbox');
    const label = screen.getByText('Test Label');

    // Initial state
    expect(label).toHaveClass('top-1/2 -translate-y-1/2 py-[12px]');

    // Focus
    await user.click(input);
    expect(label).toHaveClass('top-[4px] text-xs mocked-light-font-style');

    // Type
    await user.type(input, 'Test');
    expect(label).toHaveClass('top-[4px] text-xs mocked-light-font-style');

    // Blur with value
    await user.tab();
    expect(label).toHaveClass('top-[4px] text-xs mocked-light-font-style');

    // Clear and blur
    await user.clear(input);
    await user.tab();
    expect(label).toHaveClass('top-1/2 -translate-y-1/2 py-[12px]');
  });

  it('calls child component event handlers', async () => {
    const user = userEvent.setup();
    const onChangeMock = jest.fn();
    const onFocusMock = jest.fn();
    const onBlurMock = jest.fn();

    render(
      <FloatingPlaceholder {...defaultProps}>
        <input type="text" onChange={onChangeMock} onFocus={onFocusMock} onBlur={onBlurMock} />
      </FloatingPlaceholder>,
    );

    const input = screen.getByRole('textbox');

    // Test focus
    await user.click(input);
    expect(onFocusMock).toHaveBeenCalledTimes(1);

    // Test change
    await user.type(input, 'Test');
    expect(onChangeMock).toHaveBeenCalledTimes(4); // Once for each character

    // Test blur
    await user.tab();
    expect(onBlurMock).toHaveBeenCalledTimes(1);
  });

  it('handles non-input children correctly', () => {
    render(
      <FloatingPlaceholder {...defaultProps}>
        <div>Non-input child</div>
      </FloatingPlaceholder>,
    );

    expect(screen.getByText('Non-input child')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });
});
