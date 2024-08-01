import { z } from 'zod';

export function isValidEmail(email: string): boolean {
  try {
    z.string().email().parse(email);
    return true;
  } catch (error) {
    return false;
  }
}