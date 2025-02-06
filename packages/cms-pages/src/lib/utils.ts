import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function nl2br(str?: string) {
  if (!str) return '';
  return str.split('\n').join('<br>');
}

export function slug(str: string) {
  return str
    .toLowerCase()
    .replace(/[\s\W]+/g, '-')
    .replace(/-$/, '');
}

export function getRevalidationValue() {
  const revalidateTime = Number(process.env.NEXT_PUBLIC_REVALIDATE);
  return !isNaN(revalidateTime) ? revalidateTime : false;
}
