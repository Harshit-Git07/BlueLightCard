export function convertDateUnix(date: string) {
    return new Date(date).getTime() / 1000;
}

export function transformDateToFormatYYYYMMDD(date: string | null) {
    if(date === '0000-00-00'){
        return null;
    }
    return (date !== null && date.trim().length > 0) ? new Date(date).toISOString().substring(0,10) : null;
}

export function displayDateDDMMYYYY(isoDate :string = ''): string | null {
  if(isoDate === null){
    return null;
  }

  const newDate = new Date(isoDate);
  const year: number = newDate.getFullYear();
  const month: string = (newDate.getMonth()).toString().padStart(2, '0');
  const day: string = newDate.getUTCDate().toString().padStart(2, '0');
  return `${day}/${month}/${year}`;
}
