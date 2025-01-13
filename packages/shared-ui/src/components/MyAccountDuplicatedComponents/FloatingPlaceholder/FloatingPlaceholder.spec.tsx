import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FloatingPlaceholder, { FloatingPlaceholderProps } from './';
import '@testing-library/jest-dom';
import { colours } from '../../../tailwind/theme';

const testRender = (props: FloatingPlaceholderProps, value?: string) => {
  props.hasValue = !!value;
  render(
    <div>
      <input id={props.htmlFor} className="peer" />
      <FloatingPlaceholder {...props} />
    </div>,
  );
};

describe('FloatingPlaceholder', () => {
  const defaultProps: FloatingPlaceholderProps = {
    text: 'placeholder',
    htmlFor: 'test-input',
    isDisabled: false,
    hasValue: false,
  };

  it('renders with default props', () => {
    testRender(defaultProps);
    const label = screen.getByText('Placeholder'); // Transformed text
    expect(label).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test-input');
  });

  it('applies correct classes when not focused and empty', () => {
    testRender(defaultProps);
    const label = screen.getByText('Placeholder');
    expect(label).toHaveClass(
      'left-4 -translate-y-1/2 absolute transition-all pointer-events-none top-[25px] peer-focus:top-4 peer-focus:text-xs',
    );
    expect(label).not.toHaveClass('top-4 text-xs');
  });

  it('applies correct classes when not focused but has value', () => {
    testRender(defaultProps, 'foobar');

    const label = screen.getByText('Placeholder');
    expect(label).toHaveClass('top-4 text-xs');
    expect(label).toHaveClass(colours.textOnSurfaceSubtle);
    expect(label).not.toHaveClass('top-[25px] peer-focus:top-4 peer-focus:text-xs');
  });

  it('applies correct classes when focused and empty', async () => {
    testRender(defaultProps);
    const input = screen.getByRole('textbox');
    await userEvent.click(input);

    const label = screen.getByText('Placeholder');
    expect(label).toHaveClass(
      'peer-focus:top-4 peer-focus:text-xs peer-focus:font-typography-body-light',
    );
    expect(label).not.toHaveClass('top-4 text-xs');
  });

  it('handles disabled state correctly', () => {
    testRender({
      ...defaultProps,
      isDisabled: true,
    });

    const label = screen.getByText('Placeholder');
    expect(label).toHaveAttribute('aria-hidden', 'true');
    expect(label).toHaveAttribute('aria-disabled', 'true');
    expect(label).toHaveClass(colours.textOnSurfaceDisabled);
  });

  it('renders text with the first letter capitalized', () => {
    testRender({ ...defaultProps, text: 'example text' });
    expect(screen.getByText('Example text')).toBeInTheDocument();
  });
});
