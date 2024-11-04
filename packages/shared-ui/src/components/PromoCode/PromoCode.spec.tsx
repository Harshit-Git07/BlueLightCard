import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PromoCode from './index';

describe('PromoCode component', () => {
  const defaultProps = {
    onApply: jest.fn(),
  };

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<PromoCode {...defaultProps} />);

      expect(screen.getByText('Add your promo code')).toBeInTheDocument();
    });
  });

  describe('functionality tests', () => {
    it('should toggle open state when clicked', () => {
      const onStateChange = jest.fn();
      render(<PromoCode {...defaultProps} onStateChange={onStateChange} />);
      const toggleButton = screen.getByText('Add your promo code');

      fireEvent.click(toggleButton);

      expect(onStateChange).toHaveBeenCalledWith('open');
    });

    it('should call onApply when Apply button is clicked', () => {
      render(<PromoCode {...defaultProps} variant="open" />);
      const applyButton = screen.getByText('Apply');

      fireEvent.click(applyButton);

      expect(defaultProps.onApply).toHaveBeenCalled();
    });

    it('should call onChange when input value changes', () => {
      const onChange = jest.fn();
      render(<PromoCode {...defaultProps} variant="open" onChange={onChange} />);
      const input = screen.getByLabelText('Promo code input');

      fireEvent.change(input, { target: { value: 'TEST123' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('should call onRemove when Remove button is clicked in success state', () => {
      const onRemoveMock = jest.fn();
      const onStateChangeMock = jest.fn();
      render(
        <PromoCode
          {...defaultProps}
          variant="success"
          value="TEST123"
          onRemove={onRemoveMock}
          onStateChange={onStateChangeMock}
        />,
      );
      const removeButton = screen.getByText('Remove');

      fireEvent.click(removeButton);

      expect(onRemoveMock).toHaveBeenCalled();
      expect(onStateChangeMock).toHaveBeenCalledWith('default');
    });
  });

  describe('visual tests', () => {
    it('should show info message when provided', () => {
      const infoMessage = 'Special offer applied';

      render(<PromoCode {...defaultProps} infoMessage={infoMessage} />);

      expect(screen.getByText(infoMessage)).toBeInTheDocument();
    });

    it('should show error message when in error state', () => {
      const errorMessage = 'Invalid code';

      render(<PromoCode {...defaultProps} variant="error" errorMessage={errorMessage} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should show success message in success state', () => {
      const value = 'TEST123';

      render(<PromoCode {...defaultProps} variant="success" value={value} />);

      expect(screen.getByText('ID Upload Skipped!')).toBeInTheDocument();
    });

    it('should show icon when icon prop is true', () => {
      render(<PromoCode {...defaultProps} icon={true} />);

      const icons = screen.getAllByRole('img', { hidden: true });
      expect(icons.length).toBeGreaterThan(1);
    });

    it('should not show promo code icon by default', () => {
      render(<PromoCode {...defaultProps} />);

      const icons = screen.getAllByRole('img', { hidden: true });
      expect(icons.length).toBe(1);
    });
  });

  describe('state changes', () => {
    it('should be open when variant is "open"', () => {
      render(<PromoCode {...defaultProps} variant="open" />);

      expect(screen.getByLabelText('Promo code input')).toBeInTheDocument();
    });

    it('should be open when variant is "error"', () => {
      render(<PromoCode {...defaultProps} variant="error" />);

      expect(screen.getByLabelText('Promo code input')).toBeInTheDocument();
    });

    it('should show success state when variant is "success"', () => {
      const value = 'TEST123';

      render(<PromoCode {...defaultProps} variant="success" value={value} />);

      expect(screen.getByText(value)).toBeInTheDocument();
      expect(screen.getByText('Remove')).toBeInTheDocument();
    });
  });

  describe('accessibility tests', () => {
    it('should have accessible button for toggling', () => {
      render(<PromoCode {...defaultProps} />);

      const toggleButton = screen.getByRole('button', { name: /Add your promo code/i });
      expect(toggleButton).toBeInTheDocument();
    });

    it('should have accessible input when open', () => {
      render(<PromoCode {...defaultProps} variant="open" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Promo code input');
    });

    it('should have accessible apply button when open', () => {
      render(<PromoCode {...defaultProps} variant="open" />);

      const applyButton = screen.getByRole('button', { name: /Apply/i });
      expect(applyButton).toBeInTheDocument();
    });
  });

  describe('default props', () => {
    it('should use default label when not provided', () => {
      render(<PromoCode {...defaultProps} />);

      expect(screen.getByText('Add your promo code')).toBeInTheDocument();
    });

    it('should not show promo code icon by default', () => {
      render(<PromoCode {...defaultProps} />);

      const icons = screen.getAllByRole('img', { hidden: true });
      expect(icons.length).toBe(1);
    });
  });
});
