import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FloatingPlaceholder, { FloatingPlaceholderProps } from './';
import '@testing-library/jest-dom';
import { colours } from '../../tailwind/theme';

const testRender = (props: FloatingPlaceholderProps, value?: string) => {
  props.hasValue = !!value;
  render(
    <div>
      <input id={props.htmlFor} className={'peer'} />
      <FloatingPlaceholder {...props}>{props.children}</FloatingPlaceholder>
    </div>,
  );
};

describe('FloatingPlaceholder', () => {
  const defaultProps: FloatingPlaceholderProps = {
    htmlFor: 'test-input',
    isDisabled: false,
    hasValue: false,
    children: 'Test Label',
  };

  it('renders with default props', () => {
    testRender(defaultProps);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test-input');
  });

  it('applies correct classes when not focused and empty', () => {
    testRender(defaultProps);
    const label = screen.getByText('Test Label');
    expect(label).toHaveClass(
      'left-4 -translate-y-1/2 absolute transition-all pointer-events-none top-[25px] peer-focus:top-4 peer-focus:text-xs peer-focus:font-typography-body-light',
    );
    expect(label).not.toHaveClass('top-4 text-xs');
  });

  it('applies correct classes when not focused but has value', async () => {
    testRender(defaultProps, 'foobar');

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Test Value');
    await userEvent.tab();

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('top-4 text-xs');
    expect(label).toHaveClass(colours.textOnSurfaceSubtle);
    expect(label).not.toHaveClass('top-[25px] peer-focus:top-4 peer-focus:text-xs');
  });

  it('handles disabled state correctly', () => {
    testRender({
      ...defaultProps,
      isDisabled: true,
    });

    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('aria-hidden', 'true');
    expect(label).toHaveAttribute('aria-disabled', 'true');
    expect(label).toHaveClass(colours.textOnSurfaceDisabled);
  });
});
