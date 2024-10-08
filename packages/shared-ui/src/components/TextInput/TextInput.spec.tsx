import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { TextInputProps } from './types';
import TextInput from './index';
import { jest } from '@jest/globals';

describe('TextInput component', () => {
  let props: TextInputProps;

  beforeEach(() => {
    props = {
      label: 'Test-label',
      state: 'Default',
      name: 'test-input',
      placeholder: 'Enter text',
      value: '',
      onChange: jest.fn(),
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<TextInput {...props} />);
      const input = screen.getByRole('textbox');
      expect(input).toBeTruthy();
    });
  });

  describe('functionality tests', () => {
    it('should call onChange when input value changes', () => {
      render(<TextInput {...props} />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(props.onChange).toHaveBeenCalled();
    });

    it('should limit input to maxChars', () => {
      const maxChars = 5;
      render(<TextInput {...props} maxChars={maxChars} />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '123456' } });
      expect(input.value.length).toBeLessThanOrEqual(maxChars);
    });

    it('should handle disabled state', () => {
      render(<TextInput {...props} state="Disabled" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.disabled).toBeTruthy();
    });
  });

  describe('visual tests', () => {
    it('should show label when showLabel is true', () => {
      render(<TextInput {...props} showLabel={true} />);
      const label = screen.getByText('Test-label');
      expect(label).toBeTruthy();
    });

    it('should show icon when showIcon is true', () => {
      render(<TextInput {...props} showIcon={true} />);
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon).toBeTruthy();
    });

    it('should show info message when showInfoMessage is true', () => {
      render(<TextInput {...props} showInfoMessage={true} infoMessage="Test message" />);
      const message = screen.getByText('Test message');
      expect(message).toBeTruthy();
    });
  });

  describe('state changes', () => {
    it('should change to Active state on focus', () => {
      render(<TextInput {...props} />);
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      expect(input.classList.contains('border-colour-primary')).toBeTruthy();
    });

    it('should change to Filled state when value is present', () => {
      render(<TextInput {...props} value="Test" />);
      const input = screen.getByRole('textbox');
      expect(input.classList.contains('border-colour-onSurface-outline')).toBeTruthy();
    });
  });

  describe('snapshot tests', () => {
    it('renders default input correctly', () => {
      const tree = renderer.create(<TextInput {...props} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders input with label and icon', () => {
      const tree = renderer
        .create(<TextInput {...props} showLabel={true} showIcon={true} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders input in error state', () => {
      const tree = renderer
        .create(
          <TextInput {...props} state="Error" infoMessage="Error message" showInfoMessage={true} />,
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
