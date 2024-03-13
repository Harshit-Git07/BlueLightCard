import moment from 'moment';

export const formatDateDDMMYYYY = (date: string) => {
  if (!date) return null;
  return moment.utc(date).format('DD/MM/yyyy');
};
