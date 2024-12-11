import moment from 'moment';

export const getCardAgeInDays = (dateStr: string) => {
  const m = moment(dateStr, 'YYYY-MM-DD');
  const mInMilliSeconds = Number(m.format('x'));
  const elapsedMs = Date.now() - mInMilliSeconds;
  const dur = moment.duration(elapsedMs);
  return dur.asDays();
};
