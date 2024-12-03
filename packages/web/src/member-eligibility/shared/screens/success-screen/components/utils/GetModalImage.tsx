import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';

export function getModalImage(): string {
  switch (BRAND) {
    case BRANDS.DDS_UK:
      return '/assets/dds-modal-banner.png';
    case BRANDS.BLC_UK:
    case BRANDS.BLC_AU:
      return '/assets/uk-modal-banner.png';
  }
}
