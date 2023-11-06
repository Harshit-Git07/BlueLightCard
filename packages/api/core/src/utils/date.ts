export function convertDateUnix(date: string) {
    return new Date(date).getTime() / 1000;
}

export function transformDateToFormatYYYYMMDD(date: string | null) {
    return (date !== null && date.trim().length > 0) ? new Date(date).toISOString().substring(0,10) : null;
}