import { isUnder18 } from '../ageUtils';

describe('AgeUtils', () => {
  it('should false when age is more than 18', () => {
    const dateOfBirth = '1990-01-01';

    const result = isUnder18(dateOfBirth);

    expect(result).toBe(false);
  });

  it('should true when age is less than 18', () => {
    const dob = new Date();
    dob.setFullYear(new Date().getFullYear() - 16);
    const dateOfBirth = `${dob.getFullYear()}-${dob.getMonth() + 1}-${dob.getDate()}`;

    const result = isUnder18(dateOfBirth);

    expect(result).toBe(true);
  });

  it('should false when dob is not present', () => {
    const result = isUnder18(undefined);

    expect(result).toBe(false);
  });
});
