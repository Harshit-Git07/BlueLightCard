import { setHours, setMinutes } from 'date-fns';

export const isRedeemDateNotInRange = (drawDate: Date, redeemDate: Date) =>
  redeemDate > setMinutes(setHours(drawDate, 21), 30);
