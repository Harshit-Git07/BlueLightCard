import moment from 'moment/moment';

export function isUnder18(dateOfBirth?: string) {
  if (!dateOfBirth) {
    return false;
  }
  const age = moment().diff(dateOfBirth, 'years');
  return age < 18;
}
