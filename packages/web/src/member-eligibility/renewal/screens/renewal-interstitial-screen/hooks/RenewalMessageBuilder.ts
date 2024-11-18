import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';

interface RenewalMessage {
  part1: string;
  part2: string;
  part3: string;
}

export function generateRenewalTitle(): RenewalMessage {
  return BRAND === BRANDS.DDS_UK
    ? { part1: 'Renew your ', part2: 'Defence Discount ', part3: 'Service Card!' }
    : { part1: 'Renew your ', part2: 'Blue Light ', part3: 'Card!' };
}
