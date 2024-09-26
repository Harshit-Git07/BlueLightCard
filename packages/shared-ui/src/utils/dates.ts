import moment from 'moment';

export const formatDateDDMMYYYY = (date: string) => {
  if (!date) return null;
  return moment.utc(date).format('DD/MM/yyyy');
};

export const formatDateDMMMYYYY = (date: string) => {
  if (!date) return null;
  return moment.utc(date).format('D MMM YYYY');
};
