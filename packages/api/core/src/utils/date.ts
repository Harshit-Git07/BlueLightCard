export function convertDateUnix(date: string) {
    return new Date(date).getTime() / 1000;
}

export function transformDateToFormatYYYYMMDD(date: string) {
    return new Date(date).toISOString().substring(0,10)
}