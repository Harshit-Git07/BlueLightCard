import { formatDateDDMMYYYY } from '../dates';

describe('formatDateDDMMYYYY', () => {
  it('Formats a date string in DD/MM/yyyy format and in UTC time', () => {
    const date = '2030-06-30T23:59:59.000Z';
    const formattedDate = formatDateDDMMYYYY(date);
    expect(formattedDate).toBe('30/06/2030');
    expect(formattedDate).not.toBe('01/07/2030');
  });

  it('Returns null if the date is not provided', () => {
    const formattedDate = formatDateDDMMYYYY('');
    expect(formattedDate).toBeNull();
  });
});
