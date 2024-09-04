import { isWithinInterval, parseISO } from 'date-fns';

export const isCurrentUKDateInRange = (startDate: string, endDate: string) => {
  const currentDateTime = new Date();
  const currentUKTime = currentDateTime.toLocaleString('en-US', { timeZone: 'Europe/London' });
  const currentDateTimeISO = new Date(currentUKTime);
  return isWithinInterval(currentDateTimeISO, { start: parseISO(startDate), end: parseISO(endDate) });
};
