import moment from 'moment';

export const formatDateDDMMYYYY = (date: string) => {
  if (!date) return null;
  return moment.utc(date).format('DD/MM/yyyy');
};

export function nowInSecondsSinceEpoch(): number {
  return Math.floor(Date.now() / 1000);
}
