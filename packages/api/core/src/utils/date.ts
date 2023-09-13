export function convertDateUnix(date: string) {
    return new Date(date).getTime() / 1000;
}