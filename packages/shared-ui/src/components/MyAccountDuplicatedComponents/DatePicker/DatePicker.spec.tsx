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

  const dayEl = await findByText(day);
  await act(async () => {
    await userEvent.click(dayEl);
    await userEvent.click(monthDropdown);
  });
  const monthEl = await findByText(month);
  await act(async () => {
    await userEvent.click(monthEl);
    await userEvent.click(yearDropdown);
  });
  const yearEl = await findByText(year);
  await act(async () => {
    await userEvent.click(yearEl);
  });
};

describe('DatePicker component', () => {
  let props: ComponentProps<typeof DatePicker>;

  beforeEach(() => {
    props = {
      onChange: jest.fn(),
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

    const day = getByText('20');
    await act(async () => {
      await userEvent.click(day);
    });

    expect(dayDropdown).toHaveValue('20');
  });

  it('should not allow user interactions when disabled', async () => {
    render(<DatePicker isDisabled {...props} />);

    const dayDropdown = getByLabelText('Day');
    const monthDropdown = getByLabelText('Month');
    const yearDropdown = getByLabelText('Year');

    expect(dayDropdown).toBeDisabled();
    expect(monthDropdown).toBeDisabled();
    expect(yearDropdown).toBeDisabled();

    await act(async () => {
      await userEvent.click(dayDropdown);
    });
    const day = queryByText('20');
    expect(day).not.toBeInTheDocument();
  });

  it('should call onChange when modified', async () => {
    const onChangeSpy = jest.spyOn(props, 'onChange');
    render(<DatePicker {...props} />);
    await selectDate('2', '9', '1995');
    expect(onChangeSpy).toHaveBeenCalledTimes(3);
  });

  it('should show validation message when passed in', async () => {
    render(<DatePicker validationMessage="Date is invalid" {...props} />);

    await selectDate('20', '4', '1995');

    expect(getByText('Date is invalid')).toBeInTheDocument();
  });

  it.skip('should call onChange with nothing when invalid date', async () => {
    const onChangeSpy = jest.spyOn(props, 'onChange');
    render(<DatePicker {...props} />);
    await selectDate('20', '4', '1995');
    expect(onChangeSpy).toHaveBeenCalledWith(new Date('1995-04-02'));
  });

  it('should render error message when errorMessage is passed', () => {
    render(<DatePicker isValid={false} validationMessage="Invalid date" {...props} />);
    expect(getByText('Invalid date')).toBeInTheDocument();
  });

  it('should render with wrapped info when info is passed', () => {
    const infoProps = {
      ...props,
      label: 'Date of birth',
    };
    render(<DatePicker {...infoProps} />);

    expect(getByText('Date of birth')).toBeInTheDocument();
  });
});
