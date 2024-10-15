import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import Checkbox from './index';

describe('Checkbox Component', () => {
  it('renders correctly with the correct unchecked state', () => {
    render(
      <Checkbox
        variant="Default"
        isChecked={false}
        isDisabled={false}
        checkboxText="Checkbox label"
        onChange={() => {}}
      />,
    );

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('renders correctly with the correct checked state', () => {
    render(
      <Checkbox
        variant="Default"
        isChecked={true}
        isDisabled={false}
        checkboxText="Checkbox label"
        onChange={() => {}}
      />,
    );

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  test('calls onChange handler when toggled', () => {
    const handleChange = jest.fn();

    render(
      <Checkbox
        variant="Default"
        isChecked={false}
        isDisabled={false}
        checkboxText="Checkbox label"
        onChange={handleChange}
      />,
    );

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
