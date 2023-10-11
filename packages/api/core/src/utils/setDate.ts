export function setDate(date: any) : string{
    if (date === '0000-00-00 00:00:00' || date === null || date === undefined  || date === '' || date === 'undefined' || isNaN(Date.parse(date))) {
      return '0000000000000000';
    }
    return String(new Date(date.toString()).getTime());
}