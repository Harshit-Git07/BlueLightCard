import { isValid } from 'date-fns';

export function setDate(date: any) {
    if (date === '0000-00-00 00:00:00' || date === null || date === undefined  || date === '' 
    || !isValid(date) || date === 'undefined') {
      return '0000000000000000';
    }
    return new Date(date.toString()).getTime();
}