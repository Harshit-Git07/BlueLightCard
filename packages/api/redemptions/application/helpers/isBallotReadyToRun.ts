import { isToday, set } from 'date-fns';

export function isBallotReadyToRun(drawDate: Date, currentDate: Date) {
  const drawDateWithTimeSet = set(drawDate, { hours: 22, minutes: 0, seconds: 0, milliseconds: 0 });
  return isToday(drawDate) && currentDate > drawDateWithTimeSet;
}
