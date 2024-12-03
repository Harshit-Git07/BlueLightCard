import React, { FC, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PromoCode from './index';
import { PromoCodeProps } from './types';
import { userEvent } from '@storybook/testing-library';

const onApplyMock = jest.fn();
const onStateChangeMock = jest.fn();
const onRemoveMock = jest.fn();

const defaultProps: Omit<PromoCodeProps, 'onChange'> = {
  onApply: onApplyMock,
  onStateChange: onStateChangeMock,
  onRemove: onRemoveMock,
};

describe('given is rendered in default state', () => {
  beforeEach(() => {
    render(<WithPromoCodeState {...defaultProps} />);
  });

  it('should render component without error', () => {
    expect(screen.getByText('Add your promo code')).toBeInTheDocument();
  });

  it('should not show promo code icon by default', () => {
    // The image is aria-hidden so need to hidden flag to find it
    const icons = screen.queryAllByRole('img', { hidden: true });
    expect(icons.length).toBe(1);
  });

  it('should have accessible button for toggling the promocode', () => {
    const toggleButton = screen.getByRole('button', { name: /Add your promo code/i });
    expect(toggleButton).toBeInTheDocument();
  });

  describe('when toggle button is clicked', () => {
    beforeEach(() => {
      const toggleButton = screen.getByText('Add your promo code');
      fireEvent.click(toggleButton);
    });

    it('should return the open state on the state change callback', () => {
      expect(onStateChangeMock).toHaveBeenCalledWith('open');
    });

    it('should show the add your promo code copy', () => {
      const input = screen.getByLabelText('Add your promo code');
      expect(input).toBeInTheDocument();
      expect(input).toBeVisible();
    });

    it('should have accessible apply button when open', () => {
      const applyButton = screen.getByRole('button', { name: /Apply/i });
      expect(applyButton).toBeInTheDocument();
    });

    it('should show the apply button in a disabled state', () => {
      const applyButton = screen.getByText('Apply');
      expect(applyButton).toBeDisabled();
    });

    describe('when a promocode is entered', () => {
      beforeEach(async () => {
        await act(async () => {
          const input = screen.getByLabelText('Add your promo code');
          await userEvent.type(input, 'TEST123');
        });
      });

      it('should enable the apply button', () => {
        const applyButton = screen.getByText('Apply');
        expect(applyButton).toBeEnabled();
      });

      describe('when the apply button is clicked', () => {
        beforeEach(() => {
          const applyButton = screen.getByText('Apply');
          fireEvent.click(applyButton);
        });

        it('should call onApply when Apply button is clicked', () => {
          expect(onApplyMock).toHaveBeenCalled();
        });
      });
    });
  });
});

describe('given is rendered in the success state and has a value', () => {
  beforeEach(() => {
    render(<WithPromoCodeState {...defaultProps} variant="success" value="TEST123" />);
  });

  it('should show id upload skipped message', () => {
    expect(screen.getByText('ID Upload Skipped!')).toBeInTheDocument();
  });

  it('should show the value of the promo code', () => {
    expect(screen.getByText('TEST123')).toBeInTheDocument();
  });

  it('should show the remove button', () => {
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

  describe('when the remove button is clicked', () => {
    beforeEach(() => {
      const removeButton = screen.getByText('Remove');
      fireEvent.click(removeButton);
    });

    it('should call on remove callback and reset the state of the promocode component', () => {
      expect(onRemoveMock).toHaveBeenCalled();
      expect(onStateChangeMock).toHaveBeenCalledWith('default');
    });
  });
});

describe('given is rendered with an error message', () => {
  beforeEach(() => {
    render(<WithPromoCodeState {...defaultProps} errorMessage="Invalid code" />);
  });

  it('should show error message', () => {
    expect(screen.getByText('Invalid code')).toBeInTheDocument();
  });

  describe('when toggle button is clicked', () => {
    beforeEach(() => {
      const toggleButton = screen.getByText('Add your promo code');
      fireEvent.click(toggleButton);
    });

    it('should show the add your promo code copy', () => {
      expect(screen.getByLabelText('Add your promo code')).toBeInTheDocument();
    });
  });
});

describe('given is rendered with an info message', () => {
  beforeEach(() => {
    render(<WithPromoCodeState {...defaultProps} infoMessage="Special offer applied" />);
  });

  it('should show info message', () => {
    expect(screen.getByText('Special offer applied')).toBeInTheDocument();
  });
});

describe('given is rendered with an icon flag set to true', () => {
  beforeEach(() => {
    render(<WithPromoCodeState {...defaultProps} icon />);
  });

  it('should show icon on the component', () => {
    // The image is aria-hidden so need to hidden flag to find it
    const icons = screen.getAllByRole('img', { hidden: true });
    expect(icons.length).toEqual(2);
  });
});

const WithPromoCodeState: FC<Omit<PromoCodeProps, 'onChange'>> = (props) => {
  const [promoCode, setPromoCode] = useState(props.value ?? '');

  return (
    <PromoCode
      {...props}
      value={promoCode}
      onChange={(event) => setPromoCode(event.target.value)}
    />
  );
};
