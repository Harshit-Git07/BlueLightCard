import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';

interface WelcomeMessage {
  line1: string;
  line2: string;
  line3: string;
}

export function generateWelcomeMessage(): WelcomeMessage {
  return BRAND === BRANDS.DDS_UK
    ? { line1: 'Welcome to the ', line2: 'Defence Discount ', line3: 'Service!' }
    : { line1: 'Welcome to', line2: 'Blue Light ', line3: 'Card!' };
}
