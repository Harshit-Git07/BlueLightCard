import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RadioButtonInput from './index';
import { userEvent } from '@storybook/testing-library';
describe('RadioButtonInput component', () => {
  it('should render an input', () => {
    render(<RadioButtonInput id={'a'} name={'abc'} />);
    const input = screen.getByRole('radio');
    expect(input).toHaveAttribute('id', 'a');
    expect(input).toHaveAttribute('name', 'abc');
    expect(input).not.toBeChecked();
    expect(input).toBeEnabled();
  });

  it('should render a checked input', () => {
    render(<RadioButtonInput id={'a'} name={'abc'} checked />);
    const input = screen.getByRole('radio');
    expect(input).toBeChecked();
    expect(input).toBeEnabled();
  });

  it('should render a disabled input', () => {
    render(<RadioButtonInput id={'a'} name={'abc'} disabled />);
    const input = screen.getByRole('radio');
    expect(input).not.toBeChecked();
    expect(input).toBeDisabled();
  });

  it('should render a disabled checked input', () => {
    render(<RadioButtonInput id={'a'} name={'abc'} disabled checked />);
    const input = screen.getByRole('radio');
    expect(input).toBeChecked();
    expect(input).toBeDisabled();
  });

  it('should call a callback', async () => {
    const spy = jest.fn();
    render(<RadioButtonInput id={'a'} name={'abc'} onChange={spy} />);
    const input = screen.getByRole('radio');
    await userEvent.click(input);
    expect(spy).toHaveBeenCalledWith(expect.any(Object), 'a');
  });
});
