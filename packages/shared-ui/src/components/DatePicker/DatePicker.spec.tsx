import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatePicker from './';
import { act, ComponentProps } from 'react';
import userEvent from '@testing-library/user-event';

const { getByLabelText, findByText, getByText, queryByText, getAllByTestId } = screen;

const selectDate = async (day: string, month: string, year: string) => {
  const dayDropdown = getByLabelText('Day');
  const monthDropdown = getByLabelText('Month');
  const yearDropdown = getByLabelText('Year');

  await act(async () => {
    await userEvent.click(dayDropdown);
  });
  const number2 = await findByText(day);
  await act(async () => {
    await userEvent.click(number2);
    await userEvent.click(monthDropdown);
  });
  const september = await findByText(month);
  await act(async () => {
    await userEvent.click(september);
    await userEvent.click(yearDropdown);
  });
  const y1995 = await findByText(year);
  await act(async () => {
    await userEvent.click(y1995);
  });
};

describe('DatePicker component', () => {
  let props: ComponentProps<typeof DatePicker>;

  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      htmlFor: '',
    };
  });

  it('should render component without errorMessage', () => {
    const { baseElement } = render(<DatePicker {...props} />);
    expect(baseElement).toBeTruthy();
  });

  it('should render 3 dropdowns with placeholders', () => {
    render(<DatePicker {...props} />);

    const dropdowns = getAllByTestId('combobox');
    expect(dropdowns).toHaveLength(3);

    expect(getByLabelText('Day')).toBeInTheDocument();
    expect(getByLabelText('Month')).toBeInTheDocument();
    expect(getByLabelText('Year')).toBeInTheDocument();
  });

  it('should allow user interactions when enabled', async () => {
    render(<DatePicker {...props} />);

    const dayDropdown = getByLabelText('Day');
    await act(async () => {
      await userEvent.click(dayDropdown);
    });

    const day31 = getByText('31');
    await act(async () => {
      await userEvent.click(day31);
    });

    expect(dayDropdown).toHaveValue('31');
  });

  it('should not allow user interactions when disabled', async () => {
    render(<DatePicker disabled {...props} />);

    const dayDropdown = getByLabelText('Day');
    const monthDropdown = getByLabelText('Month');
    const yearDropdown = getByLabelText('Year');

    expect(dayDropdown).toBeDisabled();
    expect(monthDropdown).toBeDisabled();
    expect(yearDropdown).toBeDisabled();

    await act(async () => {
      await userEvent.click(dayDropdown);
    });
    const day31 = queryByText('31');
    expect(day31).not.toBeInTheDocument();
  });

  it('should call onChange with selected date', async () => {
    const onChangeSpy = jest.spyOn(props, 'onChange');
    render(<DatePicker {...props} />);
    await selectDate('2', 'September', '1995');
    expect(onChangeSpy).toHaveBeenCalledTimes(3);
    expect(onChangeSpy).toHaveBeenLastCalledWith(new Date('1995-09-02'));
  });

  it('should show error when invalid date', async () => {
    render(<DatePicker {...props} />);
    await selectDate('31', 'April', '1995');
    expect(getByText('Date is invalid')).toBeInTheDocument();
  });

  it('should show invalid date error as priority over errorMessage', async () => {
    render(<DatePicker {...props} errorMessage="There is an error" />);
    await selectDate('31', 'April', '1995');
    expect(getByText('Date is invalid')).toBeInTheDocument();
    expect(queryByText('There is an error')).not.toBeInTheDocument();
  });

  it('should not show invalid date error when disabled', async () => {
    render(<DatePicker {...props} disabled errorMessage="There is an error" />);

    const dayDropdown = getByLabelText('Day');
    const monthDropdown = getByLabelText('Month');
    const yearDropdown = getByLabelText('Year');

    expect(dayDropdown).toBeDisabled();
    expect(monthDropdown).toBeDisabled();
    expect(yearDropdown).toBeDisabled();

    expect(queryByText('There is an error')).not.toBeInTheDocument();
  });

  it('should call onChange with nothing when invalid date', async () => {
    const onChangeSpy = jest.spyOn(props, 'onChange');
    render(<DatePicker {...props} />);
    await selectDate('31', 'April', '1995');
    expect(onChangeSpy).toHaveBeenCalledWith();
  });

  it('should render error message when errorMessage is passed', () => {
    render(<DatePicker errorMessage="Invalid date" {...props} />);
    expect(getByText('Invalid date')).toBeInTheDocument();
  });

  it('should render with wrapped info when info is passed', () => {
    const infoProps = {
      ...props,
      label: 'Date of Birth',
      description: 'Please enter your date of birth',
    };
    render(<DatePicker {...infoProps} />);

    expect(getByText('Date of Birth')).toBeInTheDocument();
    expect(getByText('Please enter your date of birth')).toBeInTheDocument();
  });

  it('should only show years that satisfy minimum age constraint', async () => {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 100;
    const maxYear = currentYear - 18;

    const { getByLabelText, queryByText } = render(<DatePicker {...props} minAgeConstraint={18} />);

    const yearDropdown = getByLabelText('Year');
    await userEvent.click(yearDropdown);

    expect(queryByText((maxYear + 1).toString())).not.toBeInTheDocument();

    expect(queryByText(maxYear.toString())).toBeInTheDocument();
    expect(queryByText(minYear.toString())).toBeInTheDocument();
  });
});
