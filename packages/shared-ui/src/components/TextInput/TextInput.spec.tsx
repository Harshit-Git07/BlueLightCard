import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TextInput from './index';
import { TextInputProps } from './types';
import { colours } from '../../tailwind/theme';
import '@testing-library/jest-dom';

const testRender = (props: Partial<TextInputProps>) => {
  const onChange = jest.fn();
  props.onChange = onChange;
  render(<TextInput {...props} />);
  return { onChange };
};

const defaultProps = {
  id: 'test-input',
  label: 'Test-label',
  name: 'test-input',
  placeholder: 'Enter text',
  value: '',
};

describe('TextInput component', () => {
  describe('smoke test', () => {
    it('should render basic props', () => {
      testRender({
        ...defaultProps,
        id: 'foobar',
        name: 'foo',
        required: true,
        maxLength: 100,
        min: 10,
        max: 100,
      });
      const input = screen.getByRole('textbox', {});
      expect(input).toHaveAttribute('id', 'foobar');
      expect(input).toHaveAttribute('name', 'foo');
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('maxLength', '100');
      expect(input).toHaveAttribute('min', '10');
      expect(input).toHaveAttribute('max', '100');
    });

    it('should render no props', () => {
      testRender({});
      const input = screen.getByRole('textbox', {});
      expect(input).toHaveAttribute('id', expect.any(String));
      expect(input).not.toHaveAttribute('name');
      expect(input).not.toHaveAttribute('required');
      expect(input).toHaveAttribute('maxLength', '200');
      expect(input).not.toHaveAttribute('min');
      expect(input).not.toHaveAttribute('max');
    });
  });

  describe('functionality tests', () => {
    it('should call onChange when input value changes', () => {
      const { onChange } = testRender(defaultProps);
      const input = screen.getByRole('textbox', {});
      fireEvent.change(input, { target: { value: 'test' } });
      expect(onChange).toHaveBeenCalled();
    });

    it('should limit input to maxChars', () => {
      testRender({
        ...defaultProps,
        maxLength: 5,
      });
      const input = screen.getByRole('textbox', {}) as HTMLInputElement;
      fireEvent.change(input, { target: { value: '123456' } });
      expect(input.value.length).toBeLessThanOrEqual(5);
    });

    it('should handle disabled state', () => {
      testRender({
        ...defaultProps,
        isDisabled: true,
      });
      const input = screen.getByRole('textbox', {}) as HTMLInputElement;
      expect(input.disabled).toBeTruthy();
    });

    it('should set aria-describedby correctly', () => {
      testRender({
        ...defaultProps,
        message: 'Info',
        showCharCount: true,
      });
      const input = screen.getByRole('textbox', {});
      expect(input.getAttribute('aria-describedby')).toBe('test-input-info test-input-char-count');
    });
  });

  describe('visual tests', () => {
    it('should show label when supplied', () => {
      testRender({
        ...defaultProps,
        label: undefined,
      });
      const noLabel = screen.queryByText('Test-label', {});
      expect(noLabel).toBeNull();

      testRender(defaultProps);
      const label = screen.getByText('Test-label', {});
      expect(label).toBeTruthy();
    });

    it('should show icon when helpText is supplied', () => {
      testRender({
        ...defaultProps,
        tooltipText: 'help',
        showCharCount: true,
      });
      const icon = screen.queryByRole('img', { hidden: true });
      expect(icon).toBeTruthy();
    });

    it('should show info message when supplied', () => {
      testRender({
        ...defaultProps,
        message: 'Info message',
      });
      const message = screen.getByText('Info message', {});
      expect(message).toBeTruthy();
    });

    it('should display character count when showCharCount is true', () => {
      testRender({
        ...defaultProps,
        value: 'abc',
        maxLength: 9,
        showCharCount: true,
      });
      expect(screen.getByText('6 characters remaining', {})).toBeTruthy();
    });

    it('should display description when supplied', () => {
      testRender({
        ...defaultProps,
        helpText: 'Description',
        showCharCount: true,
      });
      expect(screen.getByText('Description', {})).toBeTruthy();
    });
  });

  describe('state changes', () => {
    it('should have default classes', () => {
      testRender({
        ...defaultProps,
        value: 'foobar',
      });
      const input = screen.getByRole('textbox', {});
      expect(input).toHaveClass(colours.borderOnSurfaceOutline);
      expect(input).toHaveClass(
        'focus:border-colour-primary focus:dark:border-colour-primary-dark',
      );
    });

    it('should have disabled classes', () => {
      testRender({
        ...defaultProps,
        value: 'foobar',
        isDisabled: true,
      });
      const input = screen.getByRole('textbox', {});
      expect(input).toHaveClass(colours.borderOnSurfaceOutlineSubtle);
      expect(input).not.toHaveClass(
        'focus:border-colour-primary focus:dark:border-colour-primary-dark',
      );
    });

    it('should have error classes', () => {
      testRender({
        ...defaultProps,
        value: 'foobar',
        isValid: false,
      });
      const input = screen.getByRole('textbox', {});
      expect(input).toHaveClass(colours.borderError);
      expect(input).not.toHaveClass(
        'focus:border-colour-primary focus:dark:border-colour-primary-dark',
      );
    });
  });
});
