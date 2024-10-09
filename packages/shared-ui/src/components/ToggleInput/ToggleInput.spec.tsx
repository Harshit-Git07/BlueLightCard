import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToggleInput, { toggleStyles } from './';
import { userEvent } from '@storybook/testing-library';

describe('ToggleInput component', () => {
  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<ToggleInput />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeTruthy();
    });
  });

  describe('basic render states', () => {
    it('should default to the off state', () => {
      render(<ToggleInput />);
      const bg = screen.getByTestId('toggle-bg');
      const input = screen.getByRole('checkbox');
      expect(bg).toHaveClass(toggleStyles.bg);
      expect(input).not.toBeChecked();
      expect(input).toBeEnabled();
    });

    it('should render in the on state', () => {
      render(<ToggleInput selected />);
      const bg = screen.getByTestId('toggle-bg');
      const input = screen.getByRole('checkbox');
      expect(bg).toHaveClass(toggleStyles.bgSelected);
      expect(input).toBeChecked();
      expect(input).toBeEnabled();
    });

    it('should render in the disabled off state', () => {
      render(<ToggleInput disabled />);
      const bg = screen.getByTestId('toggle-bg');
      const input = screen.getByRole('checkbox');
      expect(bg).toHaveClass(toggleStyles.bgDisabled);
      expect(input).not.toBeChecked();
      expect(input).toBeDisabled();
    });

    it('should render in the disabled on state', () => {
      render(<ToggleInput selected disabled />);
      const bg = screen.getByTestId('toggle-bg');
      const input = screen.getByRole('checkbox');
      expect(bg).toHaveClass(toggleStyles.bgDisabledSelected);
      expect(input).toBeChecked();
      expect(input).toBeDisabled();
    });
  });

  describe('callbacks', () => {
    it('should call a function passed to it as a prop', async () => {
      const spy = jest.fn();
      render(<ToggleInput onChange={spy} />);
      const input = screen.getByRole('checkbox');
      await userEvent.click(input);
      expect(spy).toHaveBeenCalled();
    });

    it('should call pass the toggle id to the callback', async () => {
      const spy = jest.fn();
      render(<ToggleInput onChange={spy} id={'foobar'} />);
      const input = screen.getByRole('checkbox');
      await userEvent.click(input);
      expect(spy).toHaveBeenCalledWith(expect.any(Object), 'foobar');
    });
  });
});
